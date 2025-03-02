import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { login } from '../../store/actions/auth.actions';
import { selectAuthError, selectIsLoading } from '../../store/selectors/auth.selectors';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginCredentials } from '../../interfaces/auth.interfaces';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule
  ]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  error$ = this.store.select(selectAuthError);
  isLoading$ = this.store.select(selectIsLoading);

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials: LoginCredentials = {
        username: this.loginForm.value.username || '',
        password: this.loginForm.value.password || ''
      };
      this.store.dispatch(login({ credentials }));
    }
  }
} 