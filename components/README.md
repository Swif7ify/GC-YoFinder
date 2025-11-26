# Atomic Design Structure

This project follows the **Atomic Design** methodology, which breaks down UI components into smaller, reusable parts organized by complexity.

## Structure

```
components/
├── atoms/          # Basic building blocks
├── molecules/      # Simple combinations of atoms
├── organisms/      # Complex UI components
└── templates/      # Page-level layouts
```

## Atoms

Atoms are the smallest, most basic building blocks of the UI. They cannot be broken down further without losing their meaning.

### Available Atoms

- **Button** - Reusable button component with variants (primary, secondary, danger, ghost)
- **Input** - Text input field with error states
- **Label** - Form label with optional required indicator
- **Badge** - Status badge with variants (default, success, warning, danger, info)
- **Avatar** - User avatar with fallback icon

### Usage Example

```tsx
import { Button, Input, Label, Badge, Avatar } from "@/components/atoms";

<Button variant="primary" size="md" icon={Icon} onClick={handleClick}>
  Click Me
</Button>
```

## Molecules

Molecules are simple combinations of atoms that form a functional unit.

### Available Molecules

- **FormField** - Input + Label combination
- **NavigationItem** - Navigation menu item with icon and badge
- **NotificationItem** - Individual notification card
- **StatsCard** - Statistics card with icon and trend
- **QuickActionCard** - Quick action card with icon
- **RecentItemCard** - Recent item display card

### Usage Example

```tsx
import { FormField, NavigationItem, StatsCard } from "@/components/molecules";

<FormField
  label="Email"
  name="email"
  required
  inputProps={{ type: "email" }}
/>
```

## Organisms

Organisms are complex UI components composed of molecules and/or atoms. They form distinct sections of an interface.

### Available Organisms

- **Header** - Main application header with navigation, notifications, and user menu
- **Sidebar** - Main navigation sidebar
- **StatsGrid** - Grid of statistics cards
- **QuickActionsGrid** - Grid of quick action cards
- **RecentItemsList** - List of recent items
- **NotificationPanel** - Notification dropdown panel

### Usage Example

```tsx
import { Header, Sidebar, StatsGrid } from "@/components/organisms";

<Header
  userData={userData}
  unreadCount={5}
  mockNotifications={notifications}
  // ... other props
/>
```

## Templates

Templates are page-level layouts that define the structure of pages without specific content.

### Available Templates

- **DashboardLayout** - Layout for dashboard pages with header and sidebar
- **AuthLayout** - Layout for authentication pages

### Usage Example

```tsx
import { DashboardLayout } from "@/components/templates";

<DashboardLayout headerProps={...} sidebarProps={...}>
  {children}
</DashboardLayout>
```

## Importing Components

You can import components from their specific directories or use the main index:

```tsx
// Specific imports
import { Button } from "@/components/atoms";
import { FormField } from "@/components/molecules";
import { Header } from "@/components/organisms";

// Or from main index
import { Button, FormField, Header } from "@/components";
```

## Best Practices

1. **Start with Atoms** - When creating a new component, check if you can use existing atoms first
2. **Compose Molecules** - Combine atoms to create molecules for reusable patterns
3. **Build Organisms** - Use molecules and atoms to build complex components
4. **Use Templates** - Apply templates for consistent page layouts
5. **Keep it Simple** - Each component should have a single responsibility
6. **Reusability** - Design components to be reusable across different contexts

## Migration Notes

The old component structure in `/component` is being gradually migrated to this new atomic design structure. New components should be created in the atomic design structure, and existing components will be refactored over time.

