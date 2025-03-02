import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

export interface LoginResult {
  success: boolean;
  error?: 'invalid_credentials';
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Тестовые данные для входа
  private readonly VALID_CREDENTIALS = {
    username: 'admin',
    password: 'admin'
  };

  constructor() {
    const token = localStorage.getItem('token');
    if (token) {
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(credentials: LoginCredentials): Promise<LoginResult> {
    return new Promise((resolve) => {
      if (credentials.username.toLowerCase() === this.VALID_CREDENTIALS.username && 
          credentials.password === this.VALID_CREDENTIALS.password) {
        const mockToken = 'mock-jwt-token';
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify({
          id: '1',
          username: this.VALID_CREDENTIALS.username,
          email: 'admin@example.com'
        }));
        this.isAuthenticatedSubject.next(true);
        resolve({ success: true });
      } else {
        resolve({ success: false, error: 'invalid_credentials' });
      }
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getCurrentUser(): UserProfile | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
} 