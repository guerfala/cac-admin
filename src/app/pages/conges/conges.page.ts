import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-conges',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <div><h1 class="page-title">Congés Scolaires</h1><p class="page-subtitle">Gérer le calendrier des vacances</p></div>
      <button class="btn btn-primary" (click)="openCreate()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Ajouter
      </button>
    </div>

    <div class="card">
      <table class="data-table">
        <thead><tr><th>Nom</th><th>Début</th><th>Fin</th><th>Saison</th><th>Actions</th></tr></thead>
        <tbody>
          <tr *ngFor="let item of items">
            <td style="font-weight:600;color:#1e293b;">{{ item.nom }}</td>
            <td>{{ item.dateDebut }}</td>
            <td>{{ item.dateFin || '—' }}</td>
            <td>{{ item.saison }}</td>
            <td><div class="table-actions">
              <button class="btn-icon edit" (click)="openEdit(item)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
              <button class="btn-icon delete" (click)="del(item)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>
            </div></td>
          </tr>
        </tbody>
      </table>
      <p *ngIf="items.length === 0" style="text-align:center;color:#94a3b8;padding:40px;">Aucun congé enregistré.</p>
    </div>

    <div class="modal-overlay" *ngIf="showModal" (click)="showModal=false">
      <div class="modal" (click)="$event.stopPropagation()">
        <h2 class="modal-title">{{ editing ? 'Modifier' : 'Ajouter' }} un congé</h2>
        <div class="form-group"><label>Nom</label><input type="text" [(ngModel)]="form.nom" placeholder="Vacances d'hiver" /></div>
        <div class="form-group"><label>Date début</label><input type="date" [(ngModel)]="form.dateDebut" /></div>
        <div class="form-group"><label>Date fin</label><input type="date" [(ngModel)]="form.dateFin" /></div>
        <div class="form-group"><label>Saison</label><input type="text" [(ngModel)]="form.saison" placeholder="2024 — 2025" /></div>
        <div class="form-group">
          <label>Icône</label>
          <select [(ngModel)]="form.icon">
            <option value="leaf">Feuille (Toussaint)</option>
            <option value="snowflake">Flocon (Noël)</option>
            <option value="cloud">Nuage (Hiver)</option>
            <option value="flower">Fleur (Printemps)</option>
            <option value="calendar">Calendrier (Pont)</option>
            <option value="sun">Soleil (Été)</option>
          </select>
        </div>
        <div class="form-group"><label>Ordre</label><input type="number" [(ngModel)]="form.ordre" /></div>
        <div class="form-actions">
          <button class="btn btn-secondary" (click)="showModal=false">Annuler</button>
          <button class="btn btn-primary" (click)="save()">{{ editing ? 'Modifier' : 'Ajouter' }}</button>
        </div>
      </div>
    </div>
  `,
})
export class CongesPage implements OnInit {
  items: any[] = [];
  showModal = false;
  editing = false;
  form: any = {};

  constructor(private api: ApiService) {}
  ngOnInit(): void { this.load(); }
  load(): void { this.api.getConges().subscribe(d => this.items = d); }

  openCreate(): void { this.editing = false; this.form = { nom: '', dateDebut: '', dateFin: '', saison: '2024 — 2025', icon: 'leaf', ordre: this.items.length + 1 }; this.showModal = true; }
  openEdit(item: any): void { this.editing = true; this.form = { ...item }; this.showModal = true; }

  save(): void {
    (this.editing ? this.api.updateConge(this.form.id, this.form) : this.api.createConge(this.form))
      .subscribe(() => { this.showModal = false; this.load(); });
  }

  del(item: any): void { if (confirm(`Supprimer "${item.nom}" ?`)) this.api.deleteConge(item.id).subscribe(() => this.load()); }
}
