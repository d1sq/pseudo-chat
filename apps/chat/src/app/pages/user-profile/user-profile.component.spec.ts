import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UserProfileComponent } from './user-profile.component';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/auth.interfaces';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let authService: jest.Mocked<AuthService>;
  let router: jest.Mocked<Router>;
  
  const testUser: User = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
  };

  beforeEach(async () => {
    const authServiceSpy = {
      getCurrentUser: jest.fn().mockReturnValue(testUser),
    };
    const routerSpy = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, UserProfileComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(
      AuthService
    ) as unknown as jest.Mocked<AuthService>;
    router = TestBed.inject(Router) as unknown as jest.Mocked<Router>;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should load user data on initialization', () => {
    expect(authService.getCurrentUser).toHaveBeenCalled();
    expect(component.user).toEqual(testUser);
  });

  it('should initialize the form with user data', () => {
    expect(component.profileForm.get('username')?.value).toBe('testuser');
    expect(component.profileForm.get('email')?.value).toBe('');
  });

  it('should show an error if username is too short', () => {
    const usernameControl = component.profileForm.get('username');
    usernameControl?.setValue('ab');
    usernameControl?.markAsTouched();
    
    fixture.detectChanges();
    
    const errorElements = fixture.debugElement.queryAll(By.css('.error'));
    expect(errorElements.length).toBeGreaterThan(0);
    
    const errorText = errorElements.map((el) =>
      el.nativeElement.textContent.trim()
    );
    expect(
      errorText.some((text) => text.includes('Минимальная длина 3 символа'))
    ).toBeTruthy();
  });

  it('should show an error if email is invalid', () => {
    const emailControl = component.profileForm.get('email');
    emailControl?.setValue('invalid-email');
    emailControl?.markAsTouched();
    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(
      By.css('.form-group:last-of-type .error')
    );
    expect(errorElement?.nativeElement.textContent.trim()).toContain(
      'Некорректный email'
    );
  });

  it('should have a valid form with correct data', () => {
    const usernameControl = component.profileForm.get('username');
    const emailControl = component.profileForm.get('email');
    
    usernameControl?.setValue('testuser');
    emailControl?.setValue('valid@example.com');
    
    expect(component.profileForm.valid).toBeTruthy();
  });

  it('should have a disabled save button when the form is invalid', () => {
    component.profileForm.get('email')?.setValue('invalid-email');
    fixture.detectChanges();
    
    const saveButton = fixture.debugElement.query(By.css('.save-button'));
    expect(saveButton.nativeElement.disabled).toBeTruthy();
  });

  it('should have an enabled save button when the form is valid', () => {
    component.profileForm.get('username')?.setValue('testuser');
    component.profileForm.get('email')?.setValue('valid@example.com');
    fixture.detectChanges();
    
    const saveButton = fixture.debugElement.query(By.css('.save-button'));
    expect(saveButton.nativeElement.disabled).toBeFalsy();
  });

  it('should call goBack method when back button is clicked', () => {
    jest.spyOn(component, 'goBack');
    
    const backButton = fixture.debugElement.query(By.css('.back-button'));
    backButton.triggerEventHandler('click', null);
    
    expect(component.goBack).toHaveBeenCalled();
  });

  it('should navigate to the home page when goBack is called', () => {
    component.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
}); 
