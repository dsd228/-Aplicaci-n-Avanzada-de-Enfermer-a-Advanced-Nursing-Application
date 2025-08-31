// tests/utilities.test.js - Tests for utility functions
import { 
  $, 
  fmtDate, 
  fmtTime, 
  toF, 
  toC, 
  handleError, 
  safeJSONParse, 
  safeLocalStorageGet,
  safeLocalStorageSet 
} from '../modules/utilities.js';

describe('Utilities', () => {
  describe('DOM utilities', () => {
    test('$ should select elements by selector', () => {
      const element = $('#nurse-name');
      expect(element).toBeTruthy();
      expect(element.tagName).toBe('INPUT');
    });
  });

  describe('Date formatting', () => {
    test('fmtDate should format dates correctly', () => {
      const date = new Date('2023-12-25T10:30:00Z');
      const formatted = fmtDate(date);
      expect(formatted).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });

    test('fmtTime should format time correctly', () => {
      const date = new Date('2023-12-25T10:30:00Z');
      const formatted = fmtTime(date);
      expect(formatted).toMatch(/\d{1,2}:\d{2}/);
    });
  });

  describe('Temperature conversion', () => {
    test('toF should convert Celsius to Fahrenheit', () => {
      expect(toF(0)).toBe('32.0');
      expect(toF(37)).toBe('98.6');
      expect(toF(100)).toBe('212.0');
    });

    test('toC should convert Fahrenheit to Celsius', () => {
      expect(toC(32)).toBe('0.0');
      expect(toC(98.6)).toBe('37.0');
      expect(toC(212)).toBe('100.0');
    });
  });

  describe('Error handling', () => {
    beforeEach(() => {
      global.alert = jest.fn();
    });

    test('handleError should log error and show user-friendly message', () => {
      const error = new Error('Test error');
      handleError(error, 'Test context');
      
      expect(console.error).toHaveBeenCalledWith('Error in Test context:', error);
      expect(global.alert).toHaveBeenCalledWith('An error occurred in Test context. Please try again.');
    });

    test('handleError should show specific message for storage errors', () => {
      const error = new Error('storage quota exceeded');
      handleError(error, 'Test context');
      
      expect(global.alert).toHaveBeenCalledWith('Error accessing local storage. Please try refreshing the page.');
    });
  });

  describe('Safe JSON operations', () => {
    test('safeJSONParse should parse valid JSON', () => {
      const data = { test: 'value' };
      const json = JSON.stringify(data);
      const result = safeJSONParse(json);
      
      expect(result).toEqual(data);
    });

    test('safeJSONParse should return fallback for invalid JSON', () => {
      const result = safeJSONParse('invalid json', { default: true });
      
      expect(result).toEqual({ default: true });
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('Safe localStorage operations', () => {
    test('safeLocalStorageGet should retrieve and parse data', () => {
      const data = { test: 'value' };
      localStorage.getItem.mockReturnValue(JSON.stringify(data));
      
      const result = safeLocalStorageGet('test-key');
      
      expect(localStorage.getItem).toHaveBeenCalledWith('test-key');
      expect(result).toEqual(data);
    });

    test('safeLocalStorageGet should return fallback for missing key', () => {
      localStorage.getItem.mockReturnValue(null);
      
      const result = safeLocalStorageGet('missing-key', { default: true });
      
      expect(result).toEqual({ default: true });
    });

    test('safeLocalStorageSet should store data successfully', () => {
      const data = { test: 'value' };
      
      const result = safeLocalStorageSet('test-key', data);
      
      expect(localStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(data));
      expect(result).toBe(true);
    });

    test('safeLocalStorageSet should handle storage errors', () => {
      const data = { test: 'value' };
      localStorage.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });
      
      const result = safeLocalStorageSet('test-key', data);
      
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });
  });
});