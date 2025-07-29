# UI Components

## Spotlight Component

The Spotlight component creates a beautiful spotlight effect that can be used to draw attention to specific parts of your UI. This component is part of the shadcn/ui collection and uses Tailwind CSS for styling.

### Usage

```tsx
import { Spotlight } from "@/components/ui/spotlight";

export default function YourComponent() {
  return (
    <div className="relative">
      {/* Grid Background */}
      <div className="pointer-events-none absolute inset-0 [background-size:40px_40px] select-none [background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]" />
      
      {/* Spotlight */}
      <Spotlight className="-top-40 left-0" fill="white" />
      
      {/* Your content */}
      <div className="relative z-10">
        <h1>Your Content Here</h1>
      </div>
    </div>
  );
}
```

### Props

- `className`: Additional CSS classes to apply to the spotlight SVG
- `fill`: The color of the spotlight (default: "white")

### Animation

The spotlight uses a custom animation defined in the tailwind.config.js file:

```js
theme: {
  extend: {
    animation: {
      spotlight: "spotlight 2s ease .75s 1 forwards",
    },
    keyframes: {
      spotlight: {
        "0%": {
          opacity: 0,
          transform: "translate(-72%, -62%) scale(0.5)",
        },
        "100%": {
          opacity: 1,
          transform: "translate(-50%,-40%) scale(1)",
        },
      },
    },
  },
},
```

### Demo Component

A demo component is available at `@/components/spotlight-demo.tsx` that showcases the spotlight effect with a grid background.