import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { User } from '../interfaces/auth.interfaces';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: jest.Mocked<Router>;
  
  const testUser: User = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com'
  };
  
  const testToken = 'test-token';
  
  beforeEach(() => {
    const routerSpy = {
      navigate: jest.fn()
    };
    
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService,
        { provide: Router, useValue: routerSpy }
      ]
    });
    
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router) as jest.Mocked<Router>;
    
    localStorage.clear();
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('should send a POST request to /api/auth/login', () => {
    const credentials = { username: 'testuser', password: 'password' };
    const response = { user: testUser, access_token: testToken };
    
    service.login(credentials).subscribe(user => {
      expect(user).toEqual(testUser);
    });
    
    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    req.flush(response);
  });
  
  it('should send a GET request to /api/auth/profile', () => {
    service.getProfile().subscribe(user => {
      expect(user).toEqual(testUser);
    });
    
    const req = httpMock.expectOne('/api/auth/profile');
    expect(req.request.method).toBe('GET');
    req.flush(testUser);
  });
  
  it('should save and retrieve token from localStorage', () => {
    service.saveToken(testToken);
    
    expect(localStorage.getItem('token')).toBe(testToken);
    expect(service.getToken()).toBe(testToken);
  });
  
  it('should remove token from localStorage', () => {
    localStorage.setItem('token', testToken);
    service.removeToken();
    
    expect(localStorage.getItem('token')).toBeNull();
  });
  
  it('should save user in localStorage and update currentUserSubject', () => {
    service.saveUser(testUser);
    
    expect(JSON.parse(localStorage.getItem('user') || '{}')).toEqual(testUser);
    
    service.currentUser$.subscribe(user => {
      expect(user).toEqual(testUser);
    });
  });
  
  it('should remove token and user, reset currentUserSubject, and redirect to the login page', () => {
    localStorage.setItem('token', testToken);
    localStorage.setItem('user', JSON.stringify(testUser));
    service.saveUser(testUser);
    
    service.logout();
    
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    
    service.currentUser$.subscribe(user => {
      expect(user).toBeNull();
    });
    
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
