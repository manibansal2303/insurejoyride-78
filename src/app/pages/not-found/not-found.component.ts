
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="text-center">
        <h1 class="text-4xl font-bold mb-4">404</h1>
        <p class="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <a routerLink="/" class="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>
    </div>
  `
})
export class NotFoundComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit(): void {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      this.router.url
    );
  }
}
