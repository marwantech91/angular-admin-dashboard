// Mock Angular dependencies
const mockNavigate = jest.fn();
const mockPost = jest.fn();

jest.mock('@angular/core', () => ({
  Injectable: () => (target: any) => target,
  signal: (value: any) => {
    let current = value;
    const fn: any = () => current;
    fn.set = (v: any) => { current = v; };
    fn.asReadonly = () => fn;
    return fn;
  },
  computed: (fn: any) => fn,
  inject: jest.fn(),
}));

jest.mock('@angular/common/http', () => ({
  HttpClient: jest.fn(),
}));

jest.mock('@angular/router', () => ({
  Router: jest.fn(),
}));

jest.mock('rxjs', () => ({
  Observable: jest.fn(),
  tap: jest.fn((fn) => (source: any) => source),
  catchError: jest.fn((fn) => (source: any) => source),
  of: jest.fn((val) => val),
}));

// Mock localStorage
const storage: Record<string, string> = {};
const mockLocalStorage = {
  getItem: jest.fn((key) => storage[key] || null),
  setItem: jest.fn((key, value) => { storage[key] = value; }),
  removeItem: jest.fn((key) => { delete storage[key]; }),
};
Object.defineProperty(global, 'localStorage', { value: mockLocalStorage });

describe('AuthService token utilities', () => {
  const { AuthService } = require('../src/app/core/auth/auth.service');

  let service: any;

  beforeEach(() => {
    jest.clearAllMocks();
    Object.keys(storage).forEach((k) => delete storage[k]);

    service = new AuthService(
      { post: mockPost },
      { navigate: mockNavigate }
    );
  });

  describe('getToken', () => {
    it('returns null when no token stored', () => {
      expect(service.getToken()).toBeNull();
    });

    it('returns token when stored', () => {
      storage['access_token'] = 'my-token';
      expect(service.getToken()).toBe('my-token');
    });
  });

  describe('isTokenExpired', () => {
    it('returns true when no token', () => {
      expect(service.isTokenExpired()).toBe(true);
    });

    it('returns true for expired token', () => {
      const payload = { exp: Math.floor(Date.now() / 1000) - 3600 };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      storage['access_token'] = token;
      expect(service.isTokenExpired()).toBe(true);
    });

    it('returns false for valid token', () => {
      const payload = { exp: Math.floor(Date.now() / 1000) + 3600 };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      storage['access_token'] = token;
      expect(service.isTokenExpired()).toBe(false);
    });

    it('returns true for malformed token', () => {
      storage['access_token'] = 'not.a.valid.token';
      expect(service.isTokenExpired()).toBe(true);
    });
  });

  describe('getTokenExpiresIn', () => {
    it('returns 0 when no token', () => {
      expect(service.getTokenExpiresIn()).toBe(0);
    });

    it('returns remaining milliseconds for valid token', () => {
      const payload = { exp: Math.floor(Date.now() / 1000) + 60 };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      storage['access_token'] = token;

      const remaining = service.getTokenExpiresIn();
      expect(remaining).toBeGreaterThan(50000);
      expect(remaining).toBeLessThanOrEqual(60000);
    });
  });

  describe('logout', () => {
    it('clears tokens and navigates to login', () => {
      storage['access_token'] = 'token';
      storage['refresh_token'] = 'refresh';
      storage['user'] = '{}';

      service.logout();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('access_token');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('refresh_token');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user');
      expect(mockNavigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('role checks', () => {
    it('hasRole returns false when user has no roles', () => {
      expect(service.hasRole('admin')).toBe(false);
    });

    it('hasAnyRole returns false with empty roles', () => {
      expect(service.hasAnyRole(['admin', 'editor'])).toBe(false);
    });

    it('hasAllRoles returns false with empty roles', () => {
      expect(service.hasAllRoles(['admin'])).toBe(false);
    });
  });
});
