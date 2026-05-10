import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="login-header">
          <img src="logo-cac.png" alt="CAC" class="login-logo" />
          <h1 class="login-title">CAC Admin</h1>
          <p class="login-subtitle">Connectez-vous pour gérer le site du Club Athlétisme Courbevoie</p>
        </div>

        <div class="login-error" *ngIf="error">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          {{ error }}
        </div>

        <div class="form-group">
          <label>Email</label>
          <input type="email" [(ngModel)]="email" placeholder="admin@cac-athletisme.fr"
                 (keyup.enter)="login()" />
        </div>

        <div class="form-group">
          <label>Mot de passe</label>
          <div class="password-wrapper">
            <input [type]="showPassword ? 'text' : 'password'" [(ngModel)]="password"
                   placeholder="••••••••" (keyup.enter)="login()" />
            <button class="toggle-password" (click)="showPassword = !showPassword">
              <svg *ngIf="!showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              <svg *ngIf="showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            </button>
          </div>
        </div>

        <button class="btn-login" (click)="login()" [disabled]="loading">
          <span *ngIf="!loading">Se connecter</span>
          <span *ngIf="loading">Connexion...</span>
        </button>

        <a routerLink="/forgot-password" class="forgot-link">Mot de passe oublié ?</a>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      background: #1c2434;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .login-card {
      background: #fff;
      border-radius: 16px;
      padding: 48px 40px;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .login-header { text-align: center; margin-bottom: 32px; }
    .login-logo { height: 72px; margin-bottom: 16px; }
    .login-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 28px;
      letter-spacing: 2px;
      color: #1c2434;
    }
    .login-subtitle { font-size: 14px; color: #94a3b8; margin-top: 4px; }

    .login-error {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      color: #dc2626;
      font-size: 13px;
      margin-bottom: 20px;
      svg { width: 18px; height: 18px; flex-shrink: 0; }
    }

    .form-group {
      margin-bottom: 20px;
      label { display: block; font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 6px; }
      input {
        width: 100%; padding: 12px 16px;
        border: 1px solid #e2e8f0; border-radius: 8px;
        font-size: 14px; color: #1e293b; font-family: 'Outfit', sans-serif;
        transition: border-color 0.2s;
        &:focus { outline: none; border-color: #efb01f; }
      }
    }

    .password-wrapper {
      position: relative;
      input { padding-right: 48px; }
    }
    .toggle-password {
      position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
      background: none; border: none; cursor: pointer; padding: 4px;
      svg { width: 20px; height: 20px; color: #94a3b8; }
    }

    .btn-login {
      width: 100%; padding: 14px;
      background: #efb01f; color: #1c2434;
      border: none; border-radius: 8px;
      font-family: 'Outfit', sans-serif;
      font-size: 15px; font-weight: 600;
      cursor: pointer; transition: background 0.2s;
      &:hover { background: #c8940f; }
      &:disabled { opacity: 0.6; cursor: not-allowed; }
    }

    .forgot-link {
      display: block;
      text-align: center;
      margin-top: 20px;
      font-size: 13px;
      color: #efb01f;
      text-decoration: none;
      &:hover { text-decoration: underline; }
    }
  `],
})
export class LoginPage {
  email = '';
  password = '';
  error = '';
  loading = false;
  showPassword = false;

  constructor(private auth: AuthService, private router: Router) {
    if (auth.isLoggedIn()) this.router.navigate(['/dashboard']);
  }

  login(): void {
    this.error = '';
    this.loading = true;

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Email ou mot de passe incorrect';
      },
    });
  }
}
