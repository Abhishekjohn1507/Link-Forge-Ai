// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import fs from 'fs';
// import path from 'path';

// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
// const USERS_FILE = path.join(process.cwd(), 'users.json');

// interface User {
//   id: string;
//   email: string;
//   password: string;
//   name: string;
//   createdAt: string;
//   resetToken?: string;
//   resetTokenExpiry?: string;
// }

// interface UserWithoutPassword {
//   id: string;
//   email: string;
//   name: string;
//   createdAt: string;
// }

// class UserStorage {
//   private users: Map<string, User> = new Map();
//   private initialized = false;

//   private async initialize(): Promise<void> {
//     if (this.initialized) return;
    
//     try {
//       if (fs.existsSync(USERS_FILE)) {
//         const data = fs.readFileSync(USERS_FILE, 'utf-8');
//         const users: User[] = JSON.parse(data);
        
//         users.forEach(user => {
//           this.users.set(user.id, user);
//         });
//       }
//     } catch (error) {
//       console.error('Error loading users:', error);
//     }
    
//     this.initialized = true;
//   }

//   private async saveToFile(): Promise<void> {
//     try {
//       const users = Array.from(this.users.values());
//       fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
//     } catch (error) {
//       console.error('Error saving users:', error);
//     }
//   }

//   private generateId(): string {
//     return Math.random().toString(36).substr(2, 9);
//   }

//   async createUser(_email: string, _password: string, _name: string): Promise<UserWithoutPassword> {
//     await this.initialize();
    
//     // Check if user already exists
//     const existingUser = Array.from(this.users.values()).find(user => user.email === _email);
//     if (existingUser) {
//       throw new Error('User with this email already exists');
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(_password, 12);
    
//     const user: User = {
//       id: this.generateId(),
//       email: _email,
//       password: hashedPassword,
//       name: _name,
//       createdAt: new Date().toISOString()
//     };

//     this.users.set(user.id, user);
//     await this.saveToFile();

//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const { password: _, ...userWithoutPassword } = user;
//     return userWithoutPassword;
//   }

//   async authenticateUser(_email: string, _password: string): Promise<UserWithoutPassword> {
//     await this.initialize();
    
//     const user = Array.from(this.users.values()).find(u => u.email === _email);
//     if (!user) {
//       throw new Error('Invalid credentials');
//     }

//     const isValidPassword = await bcrypt.compare(_password, user.password);
//     if (!isValidPassword) {
//       throw new Error('Invalid credentials');
//     }

//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const { password: _, ...userWithoutPassword } = user;
//     return userWithoutPassword;
//   }

//   async getUserById(id: string): Promise<UserWithoutPassword | null> {
//     await this.initialize();
    
//     const user = this.users.get(id);
//     if (!user) return null;

//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const { password: _, ...userWithoutPassword } = user;
//     return userWithoutPassword;
//   }

//   async getUserByEmail(email: string): Promise<UserWithoutPassword | null> {
//     await this.initialize();
    
//     const user = Array.from(this.users.values()).find(u => u.email === email);
//     if (!user) return null;

//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const { password: _, ...userWithoutPassword } = user;
//     return userWithoutPassword;
//   }

//   generateToken(userId: string): string {
//     return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
//   }

//   verifyToken(token: string): { userId: string } | null {
//     try {
//       return jwt.verify(token, JWT_SECRET) as { userId: string };
//     } catch {
//       return null;
//     }
//   }

//   async createPasswordResetToken(email: string): Promise<string> {
//     await this.initialize();
    
//     const user = Array.from(this.users.values()).find(u => u.email === email);
//     if (!user) {
//       throw new Error('User not found');
//     }

//     const resetToken = Math.random().toString(36).substr(2, 15);
//     const resetTokenExpiry = new Date(Date.now() + 3600000).toISOString(); // 1 hour

//     user.resetToken = resetToken;
//     user.resetTokenExpiry = resetTokenExpiry;
    
//     this.users.set(user.id, user);
//     await this.saveToFile();

//     return resetToken;
//   }

//   async resetPassword(token: string, newPassword: string): Promise<boolean> {
//     await this.initialize();
    
//     const user = Array.from(this.users.values()).find(u => 
//       u.resetToken === token && 
//       u.resetTokenExpiry && 
//       new Date(u.resetTokenExpiry) > new Date()
//     );

//     if (!user) {
//       return false;
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, 12);
//     user.password = hashedPassword;
//     user.resetToken = undefined;
//     user.resetTokenExpiry = undefined;

//     this.users.set(user.id, user);
//     await this.saveToFile();

//     return true;
//   }
// }

// export const userStorage = new UserStorage();
