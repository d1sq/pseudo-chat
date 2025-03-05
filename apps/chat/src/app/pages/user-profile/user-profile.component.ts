import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class UserProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  user = this.authService.getCurrentUser();
  profileForm!: FormGroup;

  ngOnInit() {
    this.profileForm = this.fb.group({
      username: [
        this.user?.username || '',
        [Validators.required, Validators.minLength(3)],
      ],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      //
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
