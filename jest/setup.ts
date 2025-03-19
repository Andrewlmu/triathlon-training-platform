import '@testing-library/jest-dom';

// Mock Next.js's router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: {
      user: {
        id: 'mock-user-id',
        name: 'Test User',
        email: 'test@example.com',
      },
    },
    status: 'authenticated',
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
  getSession: jest.fn(),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => {
  // Just create a simple mock for each icon component we use
  const mockIcon = () => 'Icon';
  return {
    X: mockIcon,
    Edit: mockIcon,
    Trash: mockIcon,
    Bike: mockIcon,
    Footprints: mockIcon,
    Waves: mockIcon,
    Plus: mockIcon,
    Calendar: mockIcon,
    Copy: mockIcon,
    Check: mockIcon,
    RefreshCw: mockIcon,
    LogOut: mockIcon,
    LogIn: mockIcon,
    User: mockIcon,
    ChevronLeft: mockIcon,
    ChevronRight: mockIcon,
  };
});

// Mock date-fns to ensure consistent date-based tests
jest.mock('date-fns', () => {
  const actual = jest.requireActual('date-fns');
  
  // Create a fixed mock date for testing
  const mockDate = new Date('2025-03-15T12:00:00.000Z');
  
  return {
    ...actual,
    // Override functions that return the current date
    startOfToday: jest.fn(() => mockDate),
    isToday: jest.fn((date) => {
      const d = new Date(date);
      return d.getDate() === mockDate.getDate() && 
             d.getMonth() === mockDate.getMonth() && 
             d.getFullYear() === mockDate.getFullYear();
    }),
  };
});

// Mock window.fetch for API calls
global.fetch = jest.fn();

// Setup dummy localStorage for tests
class LocalStorageMock {
  store: Record<string, string>;
  
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }

  removeItem(key: string) {
    delete this.store[key];
  }
}

Object.defineProperty(window, 'localStorage', {
  value: new LocalStorageMock(),
});

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  (global.fetch as jest.Mock).mockClear();
});