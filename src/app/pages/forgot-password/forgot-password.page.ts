import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="reset-page">
      <div class="reset-card">
        <a routerLink="/login" class="back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Retour
        </a>

        <!-- ─── STEP 1: Email ─── -->
        <div *ngIf="step === 1">
          <div class="step-header">
            <div class="step-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22 4 12 13 2 4"/>
              </svg>
            </div>
            <h1 class="step-title">Mot de passe oublié</h1>
            <p class="step-desc">Entrez votre adresse email pour recevoir un code de vérification.</p>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="email" placeholder="admin@cac-athletisme.fr" (keyup.enter)="sendCode()" />
          </div>

          <div class="msg msg--error" *ngIf="error">{{ error }}</div>
          <div class="msg msg--success" *ngIf="success">{{ success }}</div>

          <button class="btn-action" (click)="sendCode()" [disabled]="loading">
            {{ loading ? 'Envoi...' : 'Envoyer le code' }}
          </button>
        </div>

        <!-- ─── STEP 2: Code ─── -->
        <div *ngIf="step === 2">
          <div class="step-header">
            <div class="step-icon step-icon--gold">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
            </div>
            <h1 class="step-title">Vérification</h1>
            <p class="step-desc">Un code à 6 chiffres a été envoyé à <strong>{{ email }}</strong></p>
          </div>

          <div class="form-group">
            <label>Code de vérification</label>
            <input type="text" [(ngModel)]="code" placeholder="000000" maxlength="6"
                   class="code-input" (keyup.enter)="verifyCode()" />
          </div>

          <div class="msg msg--error" *ngIf="error">{{ error }}</div>

          <button class="btn-action" (click)="verifyCode()" [disabled]="loading">
            {{ loading ? 'Vérification...' : 'Vérifier le code' }}
          </button>

          <button class="btn-resend" (click)="sendCode()">Renvoyer le code</button>
        </div>

        <!-- ─── STEP 3: New password ─── -->
        <div *ngIf="step === 3">
          <div class="step-header">
            <div class="step-icon step-icon--green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h1 class="step-title">Nouveau mot de passe</h1>
            <p class="step-desc">Choisissez votre nouveau mot de passe.</p>
          </div>

          <div class="form-group">
            <label>Nouveau mot de passe</label>
            <input type="password" [(ngModel)]="newPassword" placeholder="••••••••" (keyup.enter)="resetPassword()" />
          </div>

          <div class="form-group">
            <label>Confirmer le mot de passe</label>
            <input type="password" [(ngModel)]="confirmPassword" placeholder="••••••••" (keyup.enter)="resetPassword()" />
          </div>

          <div class="msg msg--error" *ngIf="error">{{ error }}</div>

          <button class="btn-action" (click)="resetPassword()" [disabled]="loading">
            {{ loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe' }}
          </button>
        </div>

        <!-- ─── Steps indicator ─── -->
        <div class="steps-indicator">
          <div class="step-dot" [class.active]="step >= 1" [class.done]="step > 1"></div>
          <div class="step-line" [class.active]="step >= 2"></div>
          <div class="step-dot" [class.active]="step >= 2" [class.done]="step > 2"></div>
          <div class="step-line" [class.active]="step >= 3"></div>
          <div class="step-dot" [class.active]="step >= 3"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reset-page {
      min-height: 100vh;
      background: #1c2434;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .reset-card {
      background: #fff;
      border-radius: 16px;
      padding: 40px;
      width: 100%;
      max-width: 440px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: #94a3b8;
      text-decoration: none;
      margin-bottom: 24px;
      svg { width: 16px; height: 16px; }
      &:hover { color: #475569; }
    }

    .step-header { text-align: center; margin-bottom: 28px; }
    .step-icon {
      width: 56px; height: 56px; border-radius: 50%;
      background: #f1f5f9; margin: 0 auto 16px;
      display: flex; align-items: center; justify-content: center;
      svg { width: 26px; height: 26px; color: #475569; }
      &--gold { background: #fffbeb; svg { color: #efb01f; } }
      &--green { background: #ecfdf5; svg { color: #10b981; } }
    }
    .step-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 26px; letter-spacing: 1px; color: #1e293b;
    }
    .step-desc { font-size: 14px; color: #94a3b8; margin-top: 6px; line-height: 1.5;
      strong { color: #1e293b; }
    }

    .form-group {
      margin-bottom: 20px;
      label { display: block; font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 6px; }
      input {
        width: 100%; padding: 12px 16px;
        border: 1px solid #e2e8f0; border-radius: 8px;
        font-size: 14px; color: #1e293b; font-family: 'Outfit', sans-serif;
        &:focus { outline: none; border-color: #efb01f; }
      }
    }
    .code-input { text-align: center; font-size: 28px !important; letter-spacing: 12px; font-weight: 600; }

    .msg {
      padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 16px;
      &--error { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; }
      &--success { background: #ecfdf5; border: 1px solid #bbf7d0; color: #16a34a; }
    }

    .btn-action {
      width: 100%; padding: 14px;
      background: #efb01f; color: #1c2434;
      border: none; border-radius: 8px;
      font-family: 'Outfit', sans-serif;
      font-size: 15px; font-weight: 600;
      cursor: pointer; transition: background 0.2s;
      &:hover { background: #c8940f; }
      &:disabled { opacity: 0.6; cursor: not-allowed; }
    }

    .btn-resend {
      display: block; width: 100%;
      background: none; border: none;
      font-family: 'Outfit', sans-serif;
      font-size: 13px; color: #94a3b8;
      cursor: pointer; margin-top: 16px;
      &:hover { color: #efb01f; }
    }

    .steps-indicator {
      display: flex; align-items: center; justify-content: center;
      gap: 0; margin-top: 32px;
    }
    .step-dot {
      width: 10px; height: 10px; border-radius: 50%;
      background: #e2e8f0; transition: all 0.3s;
      &.active { background: #efb01f; }
      &.done { background: #10b981; }
    }
    .step-line {
      width: 40px; height: 2px; background: #e2e8f0; transition: background 0.3s;
      &.active { background: #efb01f; }
    }
  `],
})
export class ForgotPasswordPage {
  step = 1;
  email = '';
  code = '';
  newPassword = '';
  confirmPassword = '';
  error = '';
  success = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  sendCode(): void {
    this.error = '';
    this.success = '';
    this.loading = true;

    this.auth.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.loading = false;
        this.success = res.message;
        this.step = 2;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Erreur lors de l\'envoi';
      },
    });
  }

  verifyCode(): void {
    this.error = '';
    this.loading = true;

    this.auth.verifyCode(this.email, this.code).subscribe({
      next: () => {
        this.loading = false;
        this.step = 3;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Code invalide ou expiré';
      },
    });
  }

  resetPassword(): void {
    this.error = '';

    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (this.newPassword.length < 6) {
      this.error = 'Le mot de passe doit faire au moins 6 caractères';
      return;
    }

    this.loading = true;

    this.auth.resetPassword(this.email, this.code, this.newPassword).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Erreur lors de la réinitialisation';
      },
    });
  }
}
