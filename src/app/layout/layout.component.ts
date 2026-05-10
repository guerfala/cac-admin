import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  sidebarOpen = true;
  user: any = {};

  menuItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Dirigeants', icon: 'people', route: '/dirigeants' },
    { label: 'Entraîneurs', icon: 'sports', route: '/entraineurs' },
    { label: 'Actualités', icon: 'article', route: '/actualites' },
    { label: 'Congés scolaires', icon: 'calendar', route: '/conges' },
    { label: 'Albums photos', icon: 'photo', route: '/albums' },
  ];

  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    this.user = this.auth.getUser() || { nom: 'Admin', email: '' };
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout(): void {
    this.auth.logout();
  }
}
