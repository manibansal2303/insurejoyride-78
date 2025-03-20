
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div class="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-bold mb-4 text-center">{{ isLogin ? 'Login' : 'Register' }}</h2>
        
        <form [formGroup]="authForm" (ngSubmit)="handleSubmit()" class="space-y-4">
          <div class="form-group">
            <label for="email" class="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
            <div *ngIf="authForm.controls['email'].invalid && authForm.controls['email'].touched" class="text-red-500 text-sm mt-1">
              Please enter a valid email
            </div>
          </div>
          
          <div class="form-group">
            <label for="password" class="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              id="password"
              formControlName="password"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
            <div *ngIf="authForm.controls['password'].invalid && authForm.controls['password'].touched" class="text-red-500 text-sm mt-1">
              Password must be at least 6 characters
            </div>
          </div>
          
          <button
            type="submit"
            [disabled]="authForm.invalid"
            class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {{ isLogin ? 'Login' : 'Register' }}
          </button>
        </form>
        
        <div class="mt-4 text-center">
          <button
            (click)="loginWithGoogle()"
            class="text-blue-500 hover:underline focus:outline-none"
          >
            Login with Google
          </button>
        </div>
        
        <div class="mt-4 text-center">
          <button
            (click)="toggleAuthMode()"
            class="text-blue-500 hover:underline focus:outline-none"
          >
            {{ isLogin ? 'Need an account? Register' : 'Already have an account? Login' }}
          </button>
        </div>
        
        <div *ngIf="isLogin" class="mt-4 text-center">
          <button
            (click)="showResetPassword = true"
            class="text-blue-500 hover:underline focus:outline-none"
          >
            Forgot password?
          </button>
        </div>
        
        <div *ngIf="showResetPassword" class="mt-4">
          <div class="form-group">
            <label for="resetEmail" class="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="resetEmail"
              [(ngModel)]="resetEmail"
              [ngModelOptions]="{standalone: true}"
              class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          
          <div class="flex space-x-2 mt-2">
            <button
              (click)="resetPassword()"
              class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Reset Password
            </button>
            <button
              (click)="showResetPassword = false"
              class="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AuthComponent implements OnInit {
  authForm: FormGroup;
  isLogin = true;
  showResetPassword = false;
  resetEmail = '';
  returnUrl = '/';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  toggleAuthMode(): void {
    this.isLogin = !this.isLogin;
  }

  async handleSubmit(): Promise<void> {
    if (this.authForm.invalid) return;

    try {
      await this.authService.login();
      this.router.navigateByUrl(this.returnUrl);
    } catch (error) {
      console.error('Authentication error:', error);
    }
  }

  async loginWithGoogle(): Promise<void> {
    try {
      await this.authService.loginWithGoogle();
      this.router.navigateByUrl(this.returnUrl);
    } catch (error) {
      console.error('Google login error:', error);
    }
  }

  async resetPassword(): Promise<void> {
    if (!this.resetEmail) return;
    
    try {
      await this.authService.resetPassword(this.resetEmail);
      this.showResetPassword = false;
      this.resetEmail = '';
      // Show success message
    } catch (error) {
      console.error('Password reset error:', error);
    }
  }
}
