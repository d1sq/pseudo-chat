import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { LoginCredentials, AuthResponse, User } from '../interfaces/auth.interfaces';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Проверяем наличие сохраненного пользователя при инициализации
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login', credentials);
  }

  getProfile(): Observable<User> {
    return this.http.get<User>('/api/auth/profile');
  }

  // Сохранение токена в localStorage
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Получение токена из localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Удаление токена при выходе
  removeToken(): void {
    localStorage.removeItem('token');
  }

  // Проверка наличия токена
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Сохранение данных пользователя
  saveUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  // Получение текущего пользователя
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Выход из системы
  logout(): void {
    this.removeToken();
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
} 