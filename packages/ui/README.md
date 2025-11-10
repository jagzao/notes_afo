# @keep-plus-plus/ui

Shared UI components and design system for Keep++.

## Installation

```bash
pnpm add @keep-plus-plus/ui @keep-plus-plus/types
```

## Usage

### Theme Provider

Wrap your app with the `ThemeProvider`:

```tsx
import { ThemeProvider } from '@keep-plus-plus/ui';

function App() {
  return (
    <ThemeProvider defaultMode="light">
      <YourApp />
    </ThemeProvider>
  );
}
```

### Using the theme

```tsx
import { useTheme } from '@keep-plus-plus/ui';

function MyComponent() {
  const { theme, mode, toggleMode } = useTheme();

  return (
    <div>
      <p>Current mode: {mode}</p>
      <button onClick={toggleMode}>Toggle Theme</button>
    </div>
  );
}
```

### Components

```tsx
import { Button, Input } from '@keep-plus-plus/ui';

function Form() {
  return (
    <form>
      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        helperText="We'll never share your email"
      />

      <Button variant="primary" size="md">
        Submit
      </Button>
    </form>
  );
}
```

## Components

### Button

```tsx
<Button variant="primary" size="md" loading={false}>
  Click me
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `fullWidth`: boolean
- `loading`: boolean

### Input

```tsx
<Input
  label="Username"
  placeholder="Enter username"
  error="Username is required"
  helperText="Choose a unique username"
/>
```

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `inputSize`: 'sm' | 'md' | 'lg'
- `fullWidth`: boolean
- `leftIcon`: ReactNode
- `rightIcon`: ReactNode

## Theme

### Colors

```tsx
import { colors } from '@keep-plus-plus/ui/theme';

const myColor = colors.primary[500];
const noteColor = colors.note.coral;
```

### Typography

```tsx
import { typography } from '@keep-plus-plus/ui/theme';

const headingStyle = typography.variants.h1;
```

### Spacing

```tsx
import { spacing } from '@keep-plus-plus/ui/theme';

const padding = spacing[4]; // 1rem
```

## Design Tokens

### Colors

- **Note colors**: 12 pastel colors for notes
- **Semantic colors**: primary, secondary, success, warning, error
- **Neutral colors**: Different for light/dark themes
- **Common colors**: white, black, transparent

### Typography

- **Font families**: Sans-serif and monospace
- **Font sizes**: xs to 5xl
- **Font weights**: light to bold
- **Variants**: h1-h6, body1-body2, label, caption, button, code

### Spacing

- **Scale**: 0 to 32 (using 8px base unit)
- **Border radius**: none to full
- **Shadows**: none to 2xl
- **Z-index**: Predefined layers

### Breakpoints

- xs: 320px
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

## Development

```bash
# Build
pnpm build

# Watch mode
pnpm dev

# Type check
pnpm typecheck

# Lint
pnpm lint
```

## Design Principles

1. **Consistency**: All components follow the same design language
2. **Accessibility**: WCAG 2.1 AA compliant
3. **Themeable**: Light and dark themes supported
4. **Responsive**: Mobile-first approach
5. **Type-safe**: Full TypeScript support

## License

MIT
