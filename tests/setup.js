// tests/setup.js - Jest test setup
import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock fetch
global.fetch = jest.fn();

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: jest.fn(() => 'mock-uuid-123'),
  },
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Setup DOM environment
document.body.innerHTML = `
  <div id="patient-select"></div>
  <div id="patients-tbody"></div>
  <div id="vitals-wrap"></div>
  <div id="meds-wrap"></div>
  <div id="notes-wrap"></div>
  <div id="fluids-wrap"></div>
  <div id="tasks-wrap"></div>
  <div id="alerts-wrap"></div>
  <div id="ews-chip"></div>
  <input id="nurse-name" />
  <input id="unit-toggle" type="checkbox" />
  <button id="btn-new-patient"></button>
  <button id="btn-export"></button>
  <button id="btn-print"></button>
  <input id="import-file" type="file" />
`;

beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
  localStorageMock.getItem.mockReturnValue(null);
});