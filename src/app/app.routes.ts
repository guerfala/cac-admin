import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { DirigeantsPage } from './pages/dirigeants/dirigeants.page';
import { EntraineursPage } from './pages/entraineurs/entraineurs.page';
import { ActualitesPage } from './pages/actualites/actualites.page';
import { CongesPage } from './pages/conges/conges.page';
import { AlbumsPage } from './pages/albums/albums.page';
import { HorairesTarifsAdminPage } from './pages/horaires-tarifs/horaires-tarifs-admin.page';
import { LoginPage } from './pages/login/login.page';
import { ForgotPasswordPage } from './pages/forgot-password/forgot-password.page';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginPage },
  { path: 'forgot-password', component: ForgotPasswordPage },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardPage },
      { path: 'dirigeants', component: DirigeantsPage },
      { path: 'entraineurs', component: EntraineursPage },
      { path: 'actualites', component: ActualitesPage },
      { path: 'horaires-tarifs', component: HorairesTarifsAdminPage },
      { path: 'conges', component: CongesPage },
      { path: 'albums', component: AlbumsPage },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
