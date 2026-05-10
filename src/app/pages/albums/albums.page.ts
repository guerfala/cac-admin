import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-albums',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <div><h1 class="page-title">Albums Photos</h1><p class="page-subtitle">Gérer les galeries photos du club</p></div>
      <button class="btn btn-primary" (click)="openCreate()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Nouvel album
      </button>
    </div>

    <!-- ALBUMS LIST -->
    <div class="albums-grid" *ngIf="!selectedAlbum">
      <div class="album-item card" *ngFor="let a of items">
        <div class="album-cover" (click)="openAlbum(a)">
          <img *ngIf="a.couverture" [src]="api.getImageUrl(a.couverture)" />
          <div *ngIf="!a.couverture" class="album-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </div>
        </div>
        <div class="album-info">
          <h3 (click)="openAlbum(a)" style="cursor:pointer;font-weight:600;color:#1e293b;">{{ a.titre }}</h3>
          <span style="font-size:13px;color:#94a3b8;">{{ a.date }}</span>
        </div>
        <div class="album-actions">
          <button class="btn-icon edit" (click)="openEdit(a)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
          <button class="btn-icon delete" (click)="del(a)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>
        </div>
      </div>
      <p *ngIf="items.length === 0" class="card" style="text-align:center;color:#94a3b8;padding:40px;grid-column:1/-1;">Aucun album.</p>
    </div>

    <!-- ALBUM DETAIL (photos) -->
    <div *ngIf="selectedAlbum">
      <button class="btn btn-secondary" (click)="selectedAlbum=null" style="margin-bottom:20px;">← Retour</button>
      <div class="card" style="margin-bottom:20px;">
        <h2 style="font-family:'Bebas Neue';font-size:28px;letter-spacing:1px;">{{ selectedAlbum.titre }}</h2>
        <p style="color:#94a3b8;margin:8px 0 20px;">{{ selectedAlbum.photos?.length || 0 }} photos</p>
        <div class="file-input-wrapper" style="max-width:400px;">
          <input type="file" accept="image/*" multiple (change)="onPhotosChange($event)" />
          <p class="file-label"><span>Ajouter des photos</span> (sélection multiple)</p>
        </div>
      </div>
      <div class="photos-admin-grid">
        <div class="photo-admin-item" *ngFor="let p of selectedAlbum.photos">
          <img [src]="api.getImageUrl(p.src)" />
          <button class="photo-delete-btn" (click)="deletePhoto(p)">×</button>
        </div>
      </div>
    </div>

    <!-- MODAL -->
    <div class="modal-overlay" *ngIf="showModal" (click)="showModal=false">
      <div class="modal" (click)="$event.stopPropagation()">
        <h2 class="modal-title">{{ editing ? 'Modifier' : 'Créer' }} un album</h2>
        <div class="form-group"><label>Titre</label><input type="text" [(ngModel)]="form.titre" /></div>
        <div class="form-group"><label>Date</label><input type="date" [(ngModel)]="form.date" /></div>
        <div class="form-group">
          <label>Couverture</label>
          <div class="file-input-wrapper">
            <input type="file" accept="image/*" (change)="onCoverChange($event)" />
            <p class="file-label"><span>Choisir une image</span></p>
          </div>
          <img *ngIf="previewUrl" [src]="previewUrl" class="preview-img" />
        </div>
        <div class="form-actions">
          <button class="btn btn-secondary" (click)="showModal=false">Annuler</button>
          <button class="btn btn-primary" (click)="save()">{{ editing ? 'Modifier' : 'Créer' }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .albums-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .album-item { padding: 0; overflow: hidden; }
    .album-cover {
      aspect-ratio: 16/10; overflow: hidden; cursor: pointer;
      img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
      &:hover img { transform: scale(1.03); }
    }
    .album-placeholder { height: 100%; display: flex; align-items: center; justify-content: center; background: #f8fafc; svg { width: 48px; height: 48px; } }
    .album-info { padding: 16px 20px 8px; }
    .album-actions { padding: 8px 20px 16px; display: flex; gap: 8px; }
    .photos-admin-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
    .photo-admin-item {
      position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden;
      img { width: 100%; height: 100%; object-fit: cover; }
    }
    .photo-delete-btn {
      position: absolute; top: 6px; right: 6px;
      width: 26px; height: 26px; border-radius: 50%;
      background: #ef4444; color: #fff; border: none;
      font-size: 16px; cursor: pointer; display: flex;
      align-items: center; justify-content: center;
      &:hover { background: #dc2626; }
    }
    @media (max-width: 768px) {
      .albums-grid { grid-template-columns: 1fr; }
      .photos-admin-grid { grid-template-columns: repeat(3, 1fr); }
    }
  `],
})
export class AlbumsPage implements OnInit {
  items: any[] = [];
  selectedAlbum: any = null;
  showModal = false;
  editing = false;
  form: any = {};
  coverFile: File | null = null;
  previewUrl: string | null = null;

  constructor(public api: ApiService) {}
  ngOnInit(): void { this.load(); }
  load(): void { this.api.getAlbums().subscribe(d => this.items = d); }

  openCreate(): void { this.editing = false; this.form = { titre: '', date: new Date().toISOString().split('T')[0] }; this.coverFile = null; this.previewUrl = null; this.showModal = true; }
  openEdit(a: any): void { this.editing = true; this.form = { ...a }; this.coverFile = null; this.previewUrl = a.couverture ? this.api.getImageUrl(a.couverture) : null; this.showModal = true; }

  onCoverChange(e: Event): void { const f = (e.target as HTMLInputElement).files?.[0]; if (f) { this.coverFile = f; this.previewUrl = URL.createObjectURL(f); } }

  save(): void {
    const fd = new FormData();
    fd.append('titre', this.form.titre);
    fd.append('date', this.form.date || '');
    if (this.coverFile) fd.append('couverture', this.coverFile);
    (this.editing ? this.api.updateAlbum(this.form.id, fd) : this.api.createAlbum(fd))
      .subscribe(() => { this.showModal = false; this.load(); });
  }

  del(a: any): void { if (confirm(`Supprimer l'album "${a.titre}" et toutes ses photos ?`)) this.api.deleteAlbum(a.id).subscribe(() => this.load()); }

  openAlbum(a: any): void { this.api.getAlbum(a.id).subscribe(d => this.selectedAlbum = d); }

  onPhotosChange(e: Event): void {
    const files = (e.target as HTMLInputElement).files;
    if (!files || !this.selectedAlbum) return;
    const fd = new FormData();
    for (let i = 0; i < files.length; i++) fd.append('files', files[i]);
    this.api.addPhotos(this.selectedAlbum.id, fd).subscribe(() => this.openAlbum(this.selectedAlbum));
  }

  deletePhoto(p: any): void {
    if (confirm('Supprimer cette photo ?'))
      this.api.deletePhoto(this.selectedAlbum.id, p.id).subscribe(() => this.openAlbum(this.selectedAlbum));
  }
}
