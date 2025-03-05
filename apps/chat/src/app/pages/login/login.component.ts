import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { login } from '../../store/actions/auth.actions';
import {
  selectAuthError,
  selectIsLoading,
} from '../../store/selectors/auth.selectors';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginCredentials } from '../../interfaces/auth.interfaces';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  loginForm = this.fb.group({
    username: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z0-9_]+$/),
      ],
    ],
    password: ['', [Validators.required, Validators.minLength(5)]],
  });

  error$ = this.store.select(selectAuthError);
  isLoading$ = this.store.select(selectIsLoading);

  get usernameControl(): AbstractControl | null {
    return this.loginForm.get('username');
  }

  get passwordControl(): AbstractControl | null {
    return this.loginForm.get('password');
  }

  getUsernameErrorMessage(): string {
    if (!this.usernameControl) return '';

    if (this.usernameControl.hasError('required')) {
      return 'Введите имя пользователя';
    }

    if (this.usernameControl.hasError('minlength')) {
      return 'Имя пользователя должно содержать не менее 3 символов';
    }

    if (this.usernameControl.hasError('pattern')) {
      return 'Имя пользователя может содержать только буквы, цифры и символ подчеркивания';
    }

    return '';
  }

  getPasswordErrorMessage(): string {
    if (!this.passwordControl) return '';

    if (this.passwordControl.hasError('required')) {
      return 'Введите пароль';
    }

    if (this.passwordControl.hasError('minlength')) {
      return 'Пароль должен содержать не менее 5 символов';
    }

    return '';
  }

  onSubmit(): void {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.valid) {
      const credentials: LoginCredentials = {
        username: this.loginForm.value.username || '',
        password: this.loginForm.value.password || '',
      };
      this.store.dispatch(login({ credentials }));
    }
  }
}
