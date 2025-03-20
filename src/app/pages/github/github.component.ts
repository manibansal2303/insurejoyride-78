
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-github',
  template: `
    <div class="min-h-screen flex flex-col">
      <header class="bg-blue-600 text-white p-4">
        <h1 class="text-2xl font-bold">GitHub Repository Setup</h1>
      </header>
      <main class="flex-1 p-4">
        <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Create GitHub Repository</h2>
          
          <div *ngIf="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {{ successMessage }}
          </div>
          
          <div *ngIf="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {{ errorMessage }}
          </div>
          
          <form [formGroup]="githubForm" (ngSubmit)="createRepository()" class="space-y-4">
            <div>
              <label for="token" class="block text-gray-700 mb-1">GitHub Personal Access Token</label>
              <input 
                type="password" 
                id="token" 
                formControlName="token" 
                class="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              >
              <p class="text-sm text-gray-500 mt-1">
                Create a token with 'repo' scope at 
                <a href="https://github.com/settings/tokens/new" target="_blank" class="text-blue-500 hover:underline">
                  GitHub Settings
                </a>
              </p>
            </div>
            
            <div>
              <label for="repoName" class="block text-gray-700 mb-1">Repository Name</label>
              <input 
                type="text" 
                id="repoName" 
                formControlName="repoName" 
                class="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="travel-insurance-app"
              >
            </div>
            
            <div>
              <label for="description" class="block text-gray-700 mb-1">Description (optional)</label>
              <input 
                type="text" 
                id="description" 
                formControlName="description" 
                class="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Travel Insurance Application"
              >
            </div>
            
            <div class="flex items-center">
              <input 
                type="checkbox" 
                id="isPrivate" 
                formControlName="isPrivate" 
                class="mr-2"
              >
              <label for="isPrivate" class="text-gray-700">Private Repository</label>
            </div>
            
            <button 
              type="submit" 
              class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              [disabled]="githubForm.invalid || isLoading"
            >
              {{ isLoading ? 'Creating...' : 'Create Repository' }}
            </button>
          </form>
          
          <div *ngIf="repoUrl" class="mt-6">
            <h3 class="text-lg font-semibold mb-2">Repository Created Successfully</h3>
            <p class="mb-2">Your repository is available at:</p>
            <a [href]="repoUrl" target="_blank" class="text-blue-500 hover:underline block mb-4">
              {{ repoUrl }}
            </a>
            
            <h4 class="font-medium mt-4 mb-2">Next Steps:</h4>
            <div class="bg-gray-100 p-4 rounded">
              <p class="font-mono text-sm mb-2">Clone your repository:</p>
              <code class="block bg-gray-800 text-white p-3 rounded text-sm overflow-x-auto">
                git clone {{ repoUrl }}
              </code>
              
              <p class="font-mono text-sm mt-4 mb-2">Or push your existing code:</p>
              <code class="block bg-gray-800 text-white p-3 rounded text-sm overflow-x-auto whitespace-pre-line">
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin {{ repoUrl.replace('https://github.com/', 'git@github.com:') }}.git
git push -u origin main
              </code>
            </div>
          </div>
        </div>
      </main>
      <footer class="bg-gray-100 p-4 text-center text-gray-600">
        <p>&copy; 2023 Travel Insurance App</p>
      </footer>
    </div>
  `
})
export class GitHubComponent implements OnInit {
  githubForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  repoUrl = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.githubForm = this.fb.group({
      token: ['', Validators.required],
      repoName: ['', Validators.required],
      description: [''],
      isPrivate: [false]
    });
  }

  ngOnInit(): void {
    console.log('GitHub component initialized');
  }

  createRepository(): void {
    if (this.githubForm.invalid) {
      return;
    }
    
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';
    
    const { token, repoName, description, isPrivate } = this.githubForm.value;
    
    const headers = new HttpHeaders({
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28'
    });
    
    const body = {
      name: repoName,
      description: description,
      private: isPrivate,
      auto_init: true,
    };
    
    this.http.post('https://api.github.com/user/repos', body, { headers })
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.successMessage = `Repository "${repoName}" created successfully!`;
          this.repoUrl = response.html_url;
          console.log('Repository created:', response);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = `Error creating repository: ${error.error?.message || 'Unknown error'}`;
          console.error('Error creating GitHub repository:', error);
        }
      });
  }
}
