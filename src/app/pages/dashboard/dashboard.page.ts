import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Vue d'ensemble du site C.A.C.I.</p>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card" *ngFor="let s of statCards">
        <div class="stat-icon" [style.background]="s.bg">
          <svg viewBox="0 0 24 24" fill="none" [attr.stroke]="s.color" stroke-width="1.5">
            <ng-container *ngIf="s.icon === 'people'">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
            </ng-container>
            <ng-container *ngIf="s.icon === 'sports'">
              <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 000 20"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
            </ng-container>
            <ng-container *ngIf="s.icon === 'article'">
              <path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2"/>
            </ng-container>
            <ng-container *ngIf="s.icon === 'photo'">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </ng-container>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-number">{{ s.value }}</span>
          <span class="stat-label">{{ s.label }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }
    .stat-card {
      background: #fff;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .stat-icon {
      width: 52px; height: 52px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      svg { width: 26px; height: 26px; }
    }
    .stat-number {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 32px; letter-spacing: 1px; color: #1e293b; display: block;
    }
    .stat-label { font-size: 13px; color: #94a3b8; }
    @media (max-width: 1024px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 600px) { .stats-grid { grid-template-columns: 1fr; } }
  `],
})
export class DashboardPage implements OnInit {
  statCards: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getStats().subscribe((stats: any) => {
      this.statCards = [
        { label: 'Dirigeants', value: stats.dirigeants, icon: 'people', color: '#3b82f6', bg: '#eff6ff' },
        { label: 'Entraîneurs', value: stats.entraineurs, icon: 'sports', color: '#10b981', bg: '#ecfdf5' },
        { label: 'Actualités', value: stats.actualites, icon: 'article', color: '#f59e0b', bg: '#fffbeb' },
        { label: 'Albums photos', value: stats.albums + ' (' + stats.photos + ' photos)', icon: 'photo', color: '#8b5cf6', bg: '#f5f3ff' },
      ];
    });
  }
}
