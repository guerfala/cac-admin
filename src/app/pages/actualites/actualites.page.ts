import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-actualites',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <div><h1 class="page-title">Actualités</h1><p class="page-subtitle">Gérer les articles et news du club</p></div>
      <button class="btn btn-primary" (click)="openCreate()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Ajouter
      </button>
    </div>

    <div class="card">
      <table class="data-table">
        <thead><tr><th>Image</th><th>Titre</th><th>Tag</th><th>Date</th><th>Actions</th></tr></thead>
        <tbody>
          <tr *ngFor="let item of items">
            <td><img *ngIf="item.image" [src]="api.getImageUrl(item.image)" class="table-photo" /></td>
            <td style="font-weight:600;color:#1e293b;max-width:300px;">{{ item.titre }}</td>
            <td><span style="background:#fffbeb;color:#d97706;padding:4px 10px;border-radius:12px;font-size:12px;font-weight:500;">{{ item.tag }}</span></td>
            <td>{{ item.date }}</td>
            <td><div class="table-actions">
              <button class="btn-icon edit" (click)="openEdit(item)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
              <button class="btn-icon delete" (click)="del(item)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>
            </div></td>
          </tr>
        </tbody>
      </table>
      <p *ngIf="items.length === 0" style="text-align:center;color:#94a3b8;padding:40px;">Aucune actualité.</p>
    </div>

    <div class="modal-overlay" *ngIf="showModal" (click)="showModal=false">
      <div class="modal" (click)="$event.stopPropagation()">
        <h2 class="modal-title">{{ editing ? 'Modifier' : 'Ajouter' }} une actualité</h2>
        <div class="form-group"><label>Titre</label><input type="text" [(ngModel)]="form.titre" /></div>
        <div class="form-group"><label>Extrait</label><textarea [(ngModel)]="form.extrait"></textarea></div>
        <div class="form-group"><label>Contenu</label><textarea [(ngModel)]="form.contenu" style="min-height:120px;"></textarea></div>
        <div class="form-group"><label>Tag</label><input type="text" [(ngModel)]="form.tag" placeholder="Club, Compétition, Stage..." /></div>
        <div class="form-group"><label>Date</label><input type="date" [(ngModel)]="form.date" /></div>
        <div class="form-group">
          <label>Image</label>
          <div class="file-input-wrapper">
            <input type="file" accept="image/*" (change)="onFileChange($event)" />
            <p class="file-label"><span>Cliquer pour choisir</span></p>
          </div>
          <img *ngIf="previewUrl" [src]="previewUrl" class="preview-img" />
        </div>
        <div class="form-actions">
          <button class="btn btn-secondary" (click)="showModal=false">Annuler</button>
          <button class="btn btn-primary" (click)="save()">{{ editing ? 'Modifier' : 'Ajouter' }}</button>
        </div>
      </div>
    </div>
  `,
})
export class ActualitesPage implements OnInit {
  items: any[] = [];
  showModal = false;
  editing = false;
  form: any = {};
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(public api: ApiService) {}
  ngOnInit(): void { this.load(); }
  load(): void { this.api.getActualites().subscribe(d => this.items = d); }

  openCreate(): void { this.editing = false; this.form = { titre: '', extrait: '', contenu: '', tag: 'Club', date: new Date().toISOString().split('T')[0] }; this.selectedFile = null; this.previewUrl = null; this.showModal = true; }
  openEdit(item: any): void { this.editing = true; this.form = { ...item }; this.selectedFile = null; this.previewUrl = item.image ? this.api.getImageUrl(item.image) : null; this.showModal = true; }

  onFileChange(e: Event): void { const f = (e.target as HTMLInputElement).files?.[0]; if (f) { this.selectedFile = f; this.previewUrl = URL.createObjectURL(f); } }

  save(): void {
    const fd = new FormData();
    fd.append('titre', this.form.titre);
    fd.append('extrait', this.form.extrait || '');
    fd.append('contenu', this.form.contenu || '');
    fd.append('tag', this.form.tag || '');
    fd.append('date', this.form.date || '');
    if (this.selectedFile) fd.append('image', this.selectedFile);
    (this.editing ? this.api.updateActualite(this.form.id, fd) : this.api.createActualite(fd))
      .subscribe(() => { this.showModal = false; this.load(); });
  }

  del(item: any): void { if (confirm(`Supprimer "${item.titre}" ?`)) this.api.deleteActualite(item.id).subscribe(() => this.load()); }
}
