# Testing Documentation

This document provides an overview of the testing approach used in the Triathlon Training Platform.

## Testing Philosophy

Our testing strategy follows these principles:

1. **Unit Tests** - Test individual components and utility functions in isolation
2. **Integration Tests** - Test interactions between components and contexts
3. **Mock External Dependencies** - Use Jest mocks for external services and APIs
4. **Test Key User Flows** - Prioritize testing important user journeys

## Testing Stack

- **Jest** - Test runner and assertion library
- **React Testing Library** - Component testing utilities
- **Jest Mocks** - For mocking context providers, API calls, and browser APIs

## Test Organization

Tests are co-located with the code they test:

- Utility functions: `src/utils/*.test.ts`
- Components: `src/components/**/*.test.tsx`
- Context providers: `src/context/*.test.tsx`

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (useful during development)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Mocking Strategy

We use several mocking approaches:

1. **Global Mocks** - In `jest/setup.ts` we mock:
   - `next/router`
   - `next-auth`
   - `date-fns` (for date-dependent tests)
   - `fetch` for API calls
   - `localStorage` for browser storage

2. **Context Mocks** - We mock context providers to test components in isolation:
   ```typescript
   jest.mock('@/context/WorkoutContext');
   
   // Before each test
   (useWorkouts as jest.Mock).mockReturnValue({
     workouts: mockWorkouts,
     addWorkout: mockAddWorkout
   });
   ```

3. **Component Mocks** - Mock child components when needed to focus testing on the component under test

## Test Examples

### Testing Utility Functions

```typescript
// src/utils/format.test.ts
describe('formatDuration', () => {
  it('formats durations less than an hour', () => {
    expect(formatDuration(30)).toBe('30m');
  });
});
```

### Testing React Components

```typescript
// src/components/WorkoutDisplay.test.tsx
it('renders the workout title and details', () => {
  render(<WorkoutDisplay workout={mockWorkout} onClose={mockOnClose} />);
  expect(screen.getByText('Sweet Spot Intervals')).toBeInTheDocument();
});
```

### Testing Context Providers

```typescript
// src/context/WorkoutContext.test.tsx
it('adds a new workout', async () => {
  mockFetchResponse(newWorkout);
  render(
    <WorkoutProvider>
      <TestComponent />
    </WorkoutProvider>
  );
  const addButton = screen.getByTestId('add-workout');
  await act(async () => {
    addButton.click();
  });
  expect(screen.getByText('Morning Swim')).toBeInTheDocument();
});
```

## Coverage Goals

We aim for:
- 80%+ coverage of utility functions
- 70%+ coverage of React components
- Focus on testing critical user flows completely

## Adding New Tests

When adding new features:
1. Create test files alongside the feature code
2. Write tests before or during feature implementation (TDD approach when possible)
3. Focus on testing behavior, not implementation details
4. For components, test what users see and interact with

## Continuous Integration

Tests are automatically run in CI/CD pipelines to ensure code quality before deployment.