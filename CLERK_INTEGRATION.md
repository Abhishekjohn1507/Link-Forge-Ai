# Clerk Integration with Convex

This document explains how the Clerk authentication system is integrated with Convex database in this URL shortener application.

## Architecture

1. **Clerk**: Handles user authentication, sign-up, sign-in, and session management.
2. **Convex**: Stores application data including users, URLs, and click statistics.

## User ID Mapping

The key challenge addressed in this integration is mapping between Clerk user IDs and Convex user IDs:

- Clerk user IDs (e.g., `user_30XB8IvCk7SWzQGsp9bpPaHRyNl`) are stored in the Convex `users` table in the `clerkId` field.
- Convex generates its own internal IDs for each user record.
- The application needs to use Convex user IDs when creating or querying URLs.

## Implementation

### Database Schema

The Convex schema includes a `clerkId` field in the `users` table and an index for efficient lookups:

```typescript
users: defineTable({
  // ... other fields
  clerkId: v.optional(v.string()), // Stores the Clerk user ID
})
  // ... other indexes
  .index("by_clerk_id", ["clerkId"]), // Index for efficient lookups
```

### User Lookup

A `getUserByClerkId` query function was added to look up Convex users by their Clerk ID:

```typescript
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
    
    if (!user) return null;
    
    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
});
```

### User Creation/Update

When a user signs in with Clerk, their information is saved to Convex:

```typescript
useEffect(() => {
  const saveUserToConvex = async () => {
    if (user) {
      // Save the user to Convex
      await convex.mutation(api.users.saveClerkUser, {
        clerkId: user._id,
        email: user.email,
        name: user.name,
        imageUrl: user.image,
        emailVerified: user.emailVerified,
      });
    }
  };
  
  if (isLoaded && user) {
    saveUserToConvex();
  }
}, [isLoaded, user]);
```

### Simplified Usage with Hook

A custom hook `useConvexUser` was created to simplify getting the Convex user ID in components:

```typescript
export function useConvexUser() {
  const { user } = useAuth();
  
  // Get the Convex user by Clerk ID
  const { data: convexUser, isLoading } = useQuery(
    api.users.getUserByClerkId,
    user ? { clerkId: user._id } : 'skip'
  );

  return {
    convexUser,
    convexUserId: convexUser?._id,
    isLoading,
    clerkUser: user,
  };
}
```

### Usage in Components

Components can now easily get the Convex user ID:

```typescript
function MyComponent() {
  const { convexUserId, clerkUser } = useConvexUser();
  
  // Use convexUserId for Convex operations
  const userUrls = useQuery(api.urls.getUrlsByUser, 
    convexUserId ? { userId: convexUserId } : 'skip'
  );
  
  // Use clerkUser for displaying user information
  return (
    <div>
      <h1>Welcome, {clerkUser?.name}</h1>
      {/* ... */}
    </div>
  );
}
```

## API Endpoints

API endpoints that need to identify users now first look up the Convex user by Clerk ID:

```typescript
// Get user from Authorization header if available
let userId: string | undefined;
let clerkId: string | undefined;
const authHeader = request.headers.get('Authorization');
if (authHeader) {
  clerkId = authHeader.replace('Bearer ', '');
  
  // First try to get user by Clerk ID
  try {
    const user = await convex.query(api.users.getUserByClerkId, { clerkId });
    if (user) {
      userId = user._id as Id<"users">;
    }
    // ... fallback logic
  } catch (error) {
    console.error('Error verifying user:', error);
    userId = undefined;
  }
}
```

## Troubleshooting

If you encounter issues with user authentication or URL operations:

1. Check that the Clerk user is properly saved to Convex by examining the `users` table.
2. Verify that the `clerkId` field is correctly populated.
3. Ensure that the `by_clerk_id` index is properly defined.
4. Check that components are using the `useConvexUser` hook correctly.