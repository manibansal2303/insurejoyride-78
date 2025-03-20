
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-index',
  template: `
    <div class="min-h-screen flex flex-col">
      <header class="bg-blue-600 text-white p-4">
        <h1 class="text-2xl font-bold">Travel Insurance App</h1>
      </header>
      <main class="flex-1 p-4">
        <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Welcome to Travel Insurance</h2>
          <p class="mb-4">Protect your journey with our comprehensive travel insurance plans.</p>
          <div class="flex space-x-4">
            <a routerLink="/auth" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              Get Started
            </a>
          </div>
        </div>
      </main>
      <footer class="bg-gray-100 p-4 text-center text-gray-600">
        <p>&copy; 2023 Travel Insurance App</p>
      </footer>
    </div>
  `
})
export class IndexComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    console.log('Index component initialized');
  }
}
