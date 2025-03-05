import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { login } from '../../store/actions/auth.actions';
import {
  selectAuthError,
  selectIsLoading,
} from '../../store/selectors/auth.selectors';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginComponent],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectAuthError, value: null },
            { selector: selectIsLoading, value: false },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form on init', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should show an error if username is too short', () => {
    const usernameControl = component.loginForm.get('username');
    usernameControl?.setValue('ab');
    usernameControl?.markAsTouched();
    fixture.detectChanges();

    expect(usernameControl?.valid).toBeFalsy();
    expect(component.getUsernameErrorMessage()).toContain(
      'не менее 3 символов'
    );
  });

  it('should show an error if password is too short', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('1234');
    passwordControl?.markAsTouched();
    fixture.detectChanges();

    expect(passwordControl?.valid).toBeFalsy();
    expect(component.getPasswordErrorMessage()).toContain(
      'не менее 5 символов'
    );
  });

  it('should have a valid form with correct data', () => {
    const usernameControl = component.loginForm.get('username');
    const passwordControl = component.loginForm.get('password');

    usernameControl?.setValue('testuser');
    passwordControl?.setValue('password123');

    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should dispatch when submitting a valid form', () => {
    jest.spyOn(store, 'dispatch');

    const usernameControl = component.loginForm.get('username');
    const passwordControl = component.loginForm.get('password');

    usernameControl?.setValue('testuser');
    passwordControl?.setValue('password123');

    component.onSubmit();

    expect(store.dispatch).toHaveBeenCalledWith(
      login({ credentials: { username: 'testuser', password: 'password123' } })
    );
  });

  it('should not dispatch when submitting an invalid form', () => {
    jest.spyOn(store, 'dispatch');

    component.onSubmit();

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should display server error', () => {
    store.overrideSelector(selectAuthError, 'Неверные учетные данные');
    store.refreshState();
    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.css('.server-error'));
    expect(errorElement.nativeElement.textContent.trim()).toBe(
      'Неверные учетные данные'
    );
  });

  it('should display loading state', () => {
    store.overrideSelector(selectIsLoading, true);
    store.refreshState();
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(By.css('button'));
    expect(buttonElement.nativeElement.textContent.trim()).toBe('Загрузка...');
    expect(buttonElement.nativeElement.disabled).toBeTruthy();
  });
});
