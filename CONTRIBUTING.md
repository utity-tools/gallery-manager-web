# Contributing to Gallery Manager

## Quick Start

1. **Setup**: `npm install`
2. **Dev**: `npm run dev` (http://localhost:3000)
3. **Build**: `npm run build`
4. **Lint**: `npm run lint`
5. **Tests**: `npm test` or `npm run test:e2e`

---

## Code Style

- **Formatter**: Prettier (auto-run on save in IDE)
- **Linter**: ESLint (run before commit)
- **Language**: TypeScript strict mode

```bash
npm run lint    # Check
npm run lint -- --fix  # Auto-fix
```

---

## Type Safety

- All components must be typed
- No `any` types (use `unknown` if needed, with type guard)
- Use Zod for API validation
- Export types alongside implementations

```typescript
// ✅ Good
interface Props {
  id: string;
  onSave: (data: Data) => Promise<void>;
}

// ❌ Bad
function Component(props: any) { }
```

---

## Error Handling

All async operations must handle errors:

```typescript
try {
  await onSave(data);
  setSuccess(true);
} catch (err) {
  const message = err instanceof Error ? err.message : "Unknown error";
  setError(message);
  // Don't auto-close on error
}
```

---

## Testing

### Unit Tests (Vitest)
```bash
npm test                    # Run tests
npm run test:ui            # Interactive UI
```

Tests validate logic, not UI rendering:
- Validation functions
- Hook behavior
- State management

### E2E Tests (Playwright)
```bash
npm run test:e2e           # Run e2e (requires dev server running)
npm run test:e2e:ui        # Interactive UI
```

E2E tests cover critical flows:
- Auth → Dashboard → Settings
- Create carousel → View public
- Error handling

**Before running e2e**: Start dev server: `npm run dev`

---

## Commit Messages

Use conventional commits:

```
feat: add hero carousel selector to Home tab
fix: prevent duplicate artworks in carousel
refactor: extract badge component
test: add validation tests for heroArtworkIds
docs: update CONTRIBUTING guide
```

---

## API Integration

### Frontend-Backend Contract

**Gallery API** (`GET /api/galleries/:id`, `PUT /api/galleries/:id`)
```typescript
{
  id: string;
  title: string;
  // ... fields
  heroArtworkIds?: string[];  // New field for carousel
  createdAt: string;          // Read-only
  updatedAt: string;          // Read-only
}
```

### Error Format

All errors follow this shape:
```typescript
{
  success: false;
  error: {
    code: "VALIDATION_ERROR" | "NOT_FOUND" | "UNAUTHORIZED";
    message: "User-friendly message";
    details?: Record<string, unknown>;
  }
}
```

---

## Before Submitting PR

- [ ] `npm run lint` passes
- [ ] `npm test -- --run` passes
- [ ] No `console.log` in production code
- [ ] Types are strict (no `any`)
- [ ] Error handling is comprehensive
- [ ] Commit messages are clear

---

## Questions?

- Check existing issues/PRs
- Ask in code comments (mark as `TODO` if blocking)
- Document non-obvious decisions

