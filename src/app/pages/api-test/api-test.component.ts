
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-api-test',
  template: `
    <div class="min-h-screen bg-gray-50 p-4">
      <div class="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-bold mb-4">API Test Page</h1>
        
        <div class="mb-6">
          <h2 class="text-lg font-semibold mb-2">User Authentication</h2>
          <div class="flex space-x-2 mb-4">
            <button 
              (click)="testLogin()" 
              class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Test Login
            </button>
            <button 
              (click)="testLogout()" 
              class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Test Logout
            </button>
          </div>
          <div *ngIf="isAuthenticated" class="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
            User is authenticated
          </div>
          <div *ngIf="!isAuthenticated" class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded">
            User is not authenticated
          </div>
        </div>
        
        <div class="mb-6">
          <h2 class="text-lg font-semibold mb-2">Insurance Quotes API</h2>
          <button 
            (click)="testGetQuotes()" 
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mb-4"
          >
            Get Insurance Quotes
          </button>
          
          <div *ngIf="quotes.length > 0" class="bg-gray-50 p-4 rounded border">
            <h3 class="font-medium mb-2">Quotes Received:</h3>
            <div *ngFor="let quote of quotes" class="mb-2 p-2 bg-white rounded shadow-sm">
              <p><strong>Plan:</strong> {{quote.planName}}</p>
              <p><strong>Price:</strong> ${{quote.price}}</p>
            </div>
          </div>
        </div>
        
        <div class="mb-6">
          <h2 class="text-lg font-semibold mb-2">User Profile API</h2>
          <button 
            (click)="testGetUserProfile()" 
            class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded mb-4"
          >
            Get User Profile
          </button>
          
          <div *ngIf="userProfile" class="bg-gray-50 p-4 rounded border">
            <h3 class="font-medium mb-2">User Profile:</h3>
            <p><strong>Name:</strong> {{userProfile.firstName}} {{userProfile.lastName}}</p>
            <p><strong>Email:</strong> {{userProfile.email}}</p>
          </div>
        </div>
        
        <div class="mt-6">
          <a routerLink="/" class="text-blue-500 hover:underline">← Back to Home</a>
        </div>
      </div>
    </div>
  `
})
export class ApiTestComponent implements OnInit {
  isAuthenticated = false;
  quotes: any[] = [];
  userProfile: any = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Check if user is authenticated on component init
    this.checkAuthStatus();
  }

  checkAuthStatus(): void {
    // For demonstration purposes, just checking localStorage
    const user = localStorage.getItem('current_user');
    this.isAuthenticated = !!user;
  }

  testLogin(): void {
    // Mock login
    const mockUser = {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com'
    };
    localStorage.setItem('current_user', JSON.stringify(mockUser));
    this.checkAuthStatus();
  }

  testLogout(): void {
    localStorage.removeItem('current_user');
    this.checkAuthStatus();
  }

  testGetQuotes(): void {
    // Mock quotes data for testing
    this.quotes = [
      {
        id: 'quote-1',
        planName: 'Basic Coverage',
        price: 49.99,
        coverage: 'Essential travel protection'
      },
      {
        id: 'quote-2',
        planName: 'Premium Coverage',
        price: 99.99,
        coverage: 'Comprehensive travel protection with medical'
      },
      {
        id: 'quote-3',
        planName: 'Ultimate Coverage',
        price: 149.99,
        coverage: 'Complete protection with cancellation insurance'
      }
    ];
  }

  testGetUserProfile(): void {
    // Mock user profile data
    this.userProfile = {
      userId: 'user-123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '555-123-4567',
      address: '123 Main St, Anytown, US 12345'
    };
  }
}
