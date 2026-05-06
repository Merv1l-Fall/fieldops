import '@testing-library/jest-dom'

// Add fetch polyfill for Node.js environment
if (!global.fetch) {
  global.fetch = jest.fn();
}

// Mock environment variables
process.env.STRIPE_SECRET_KEY = 'sk_test_mock';
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-key';

// Mock window.location.href
delete window.location;
window.location = { href: '' };

// Suppress console errors during tests (optional)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
