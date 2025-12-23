import { Component } from '@angular/core';

@Component({
  selector: 'app-not-authorized',
  template: `<div class="not-authorized">
    <mat-card>
      <mat-card-content>
        <mat-icon>block</mat-icon>
        <h1>Access Denied</h1>
        <p>You are not authorized to access this page</p>
        <button mat-raised-button color="primary" routerLink="/">Go Home</button>
      </mat-card-content>
    </mat-card>
  </div>`,
  styles: [`
    .not-authorized {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f5f5f5;
    }
    mat-card {
      text-align: center;
      max-width: 400px;
    }
    mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      color: #f44336;
      margin-bottom: 1rem;
    }
    h1 {
      color: #333;
      margin: 1rem 0;
    }
  `],
})
export class NotAuthorizedComponent {}
