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

    <!-- ALBUM DETAIL (gestion des photos) -->
    <div *ngIf="selectedAlbum">
      <button class="btn btn-secondary" (click)="selectedAlbum=null" style="margin-bottom:20px;">← Retour</button>
      <div class="card" style="margin-bottom:20px;">
        <h2 style="font-family:'Bebas Neue';font-size:28px;letter-spacing:1px;">{{ selectedAlbum.titre }}</h2>
        <p style="color:#94a3b8;margin:8px 0 20px;">{{ selectedAlbum.photos?.length || 0 }} photos</p>

        <div class="file-input-wrapper" style="max-width:500px;">
          <input type="file" accept="image/*" multiple (change)="onPhotosChange($event)" />
          <p class="file-label"><span>Cliquer pour ajouter des photos</span> (sélection multiple)</p>
        </div>

        <div *ngIf="uploadProgress" style="margin-top:12px;color:#efb01f;font-size:14px;">
          ⏳ Upload en cours... {{ uploadProgress }}
        </div>
      </div>

      <div class="photos-admin-grid" *ngIf="selectedAlbum.photos?.length > 0">
        <div class="photo-admin-item" *ngFor="let p of selectedAlbum.photos"
             [class.is-cover]="selectedAlbum.couverture === p.src">
          <img [src]="api.getImageUrl(p.src)" />
          <div class="photo-actions-overlay">
            <button class="photo-cover-btn" (click)="setCover(p)"
                    [title]="selectedAlbum.couverture === p.src ? 'Photo de couverture actuelle' : 'Définir comme couverture'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon *ngIf="selectedAlbum.couverture !== p.src" points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                <polygon *ngIf="selectedAlbum.couverture === p.src" points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor"/>
              </svg>
            </button>
            <button class="photo-delete-btn" (click)="deletePhoto(p)">×</button>
          </div>
          <span class="cover-badge" *ngIf="selectedAlbum.couverture === p.src">Couverture</span>
        </div>
      </div>

      <p *ngIf="selectedAlbum.photos?.length === 0" style="text-align:center;color:#94a3b8;padding:40px;">
        Aucune photo. Utilisez le bouton ci-dessus pour en ajouter.
      </p>
    </div>

    <!-- MODAL CREATE/EDIT -->
    <div class="modal-overlay" *ngIf="showModal" (click)="showModal=false">
      <div class="modal" (click)="$event.stopPropagation()">
        <h2 class="modal-title">{{ editing ? 'Modifier' : 'Créer' }} un album</h2>
        <div class="form-group"><label>Titre</label><input type="text" [(ngModel)]="form.titre" /></div>
        <div class="form-group"><label>Date</label><input type="date" [(ngModel)]="form.date" /></div>

        <!-- Upload photos à la création -->
        <div class="form-group" *ngIf="!editing">
          <label>Photos de l'album</label>
          <div class="file-input-wrapper">
            <input type="file" accept="image/*" multiple (change)="onCreatePhotosChange($event)" />
            <p class="file-label"><span>Choisir les photos</span> (sélection multiple)</p>
          </div>
          <div class="preview-grid" *ngIf="createPhotoPreviews.length > 0">
            <div class="preview-item" *ngFor="let p of createPhotoPreviews; let i = index">
              <img [src]="p.url" />
              <button class="preview-cover-btn" (click)="setCoverIndex(i)"
                      [class.selected]="coverIndex === i">
                {{ coverIndex === i ? '★ Couverture' : '☆' }}
              </button>
              <button class="preview-remove-btn" (click)="removeCreatePhoto(i)">×</button>
            </div>
          </div>
          <p *ngIf="createPhotoPreviews.length > 0" style="font-size:12px;color:#94a3b8;margin-top:8px;">
            Cliquez sur ☆ pour choisir la photo de couverture ({{ createPhotoFiles.length }} photos sélectionnées)
          </p>
        </div>

        <!-- Couverture pour édition -->
        <div class="form-group" *ngIf="editing">
          <label>Couverture</label>
          <div class="file-input-wrapper">
            <input type="file" accept="image/*" (change)="onCoverChange($event)" />
            <p class="file-label"><span>Changer la couverture</span></p>
          </div>
          <img *ngIf="previewUrl" [src]="previewUrl" class="preview-img" />
        </div>

        <div class="form-actions">
          <button class="btn btn-secondary" (click)="showModal=false">Annuler</button>
          <button class="btn btn-primary" (click)="save()" [disabled]="saving">
            {{ saving ? 'En cours...' : (editing ? 'Modifier' : 'Créer l\\'album') }}
          </button>
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
      position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden; border: 2px solid transparent;
      img { width: 100%; height: 100%; object-fit: cover; }
      &.is-cover { border-color: #efb01f; }
    }
    .photo-actions-overlay {
      position: absolute; top: 6px; right: 6px;
      display: flex; gap: 4px;
    }
    .photo-cover-btn {
      width: 28px; height: 28px; border-radius: 50%;
      background: rgba(0,0,0,0.6); color: #efb01f; border: none;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; svg { width: 14px; height: 14px; }
      &:hover { background: rgba(0,0,0,0.8); }
    }
    .photo-delete-btn {
      width: 28px; height: 28px; border-radius: 50%;
      background: #ef4444; color: #fff; border: none;
      font-size: 16px; cursor: pointer; display: flex;
      align-items: center; justify-content: center;
      &:hover { background: #dc2626; }
    }
    .cover-badge {
      position: absolute; bottom: 0; left: 0; right: 0;
      background: rgba(239,176,31,0.9); color: #000;
      text-align: center; font-size: 11px; font-weight: 600;
      letter-spacing: 1px; text-transform: uppercase; padding: 4px;
    }

    .preview-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 12px; }
    .preview-item {
      position: relative; aspect-ratio: 1; border-radius: 6px; overflow: hidden; border: 2px solid #e2e8f0;
      img { width: 100%; height: 100%; object-fit: cover; }
    }
    .preview-cover-btn {
      position: absolute; bottom: 0; left: 0; right: 0;
      background: rgba(0,0,0,0.6); color: #fff; border: none;
      font-size: 11px; padding: 4px; cursor: pointer;
      &.selected { background: rgba(239,176,31,0.9); color: #000; font-weight: 600; }
    }
    .preview-remove-btn {
      position: absolute; top: 4px; right: 4px;
      width: 20px; height: 20px; border-radius: 50%;
      background: #ef4444; color: #fff; border: none;
      font-size: 14px; cursor: pointer; display: flex;
      align-items: center; justify-content: center;
    }

    @media (max-width: 768px) {
      .albums-grid { grid-template-columns: 1fr; }
      .photos-admin-grid { grid-template-columns: repeat(3, 1fr); }
      .preview-grid { grid-template-columns: repeat(3, 1fr); }
    }
  `],
})
export class AlbumsPage implements OnInit {
  items: any[] = [];
  selectedAlbum: any = null;
  showModal = false;
  editing = false;
  saving = false;
  form: any = {};
  coverFile: File | null = null;
  previewUrl: string | null = null;
  uploadProgress = '';

  // Pour l'upload multiple à la création
  createPhotoFiles: File[] = [];
  createPhotoPreviews: { url: string }[] = [];
  coverIndex = 0;

  constructor(public api: ApiService) {}
  ngOnInit(): void { this.load(); }
  load(): void { this.api.getAlbums().subscribe(d => this.items = d); }

  openCreate(): void {
    this.editing = false;
    this.form = { titre: '', date: new Date().toISOString().split('T')[0] };
    this.coverFile = null;
    this.previewUrl = null;
    this.createPhotoFiles = [];
    this.createPhotoPreviews = [];
    this.coverIndex = 0;
    this.showModal = true;
  }

  openEdit(a: any): void {
    this.editing = true;
    this.form = { ...a };
    this.coverFile = null;
    this.previewUrl = a.couverture ? this.api.getImageUrl(a.couverture) : null;
    this.showModal = true;
  }

  onCoverChange(e: Event): void {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (f) { this.coverFile = f; this.previewUrl = URL.createObjectURL(f); }
  }

  onCreatePhotosChange(e: Event): void {
    const files = (e.target as HTMLInputElement).files;
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      this.createPhotoFiles.push(files[i]);
      this.createPhotoPreviews.push({ url: URL.createObjectURL(files[i]) });
    }
  }

  removeCreatePhoto(index: number): void {
    this.createPhotoFiles.splice(index, 1);
    this.createPhotoPreviews.splice(index, 1);
    if (this.coverIndex >= this.createPhotoFiles.length) this.coverIndex = 0;
  }

  setCoverIndex(index: number): void {
    this.coverIndex = index;
  }

  save(): void {
    this.saving = true;

    if (this.editing) {
      const fd = new FormData();
      fd.append('titre', this.form.titre);
      fd.append('date', this.form.date || '');
      if (this.coverFile) fd.append('couverture', this.coverFile);
      this.api.updateAlbum(this.form.id, fd).subscribe(() => {
        this.showModal = false;
        this.saving = false;
        this.load();
      });
    } else {
      // Créer l'album avec la photo de couverture
      const fd = new FormData();
      fd.append('titre', this.form.titre);
      fd.append('date', this.form.date || '');
      if (this.createPhotoFiles.length > 0) {
        fd.append('couverture', this.createPhotoFiles[this.coverIndex]);
      }

      this.api.createAlbum(fd).subscribe((album: any) => {
        // Uploader toutes les photos
        if (this.createPhotoFiles.length > 0) {
          const photoFd = new FormData();
          this.createPhotoFiles.forEach(f => photoFd.append('files', f));

          this.api.addPhotos(album.id, photoFd).subscribe(() => {
            this.showModal = false;
            this.saving = false;
            this.load();
          });
        } else {
          this.showModal = false;
          this.saving = false;
          this.load();
        }
      });
    }
  }

  del(a: any): void {
    if (confirm(`Supprimer l'album "${a.titre}" et toutes ses photos ?`))
      this.api.deleteAlbum(a.id).subscribe(() => this.load());
  }

  openAlbum(a: any): void {
    this.api.getAlbum(a.id).subscribe(d => this.selectedAlbum = d);
  }

  onPhotosChange(e: Event): void {
    const files = (e.target as HTMLInputElement).files;
    if (!files || !this.selectedAlbum) return;
    this.uploadProgress = `0/${files.length} photos...`;
    const fd = new FormData();
    for (let i = 0; i < files.length; i++) fd.append('files', files[i]);
    this.api.addPhotos(this.selectedAlbum.id, fd).subscribe(() => {
      this.uploadProgress = '';
      this.openAlbum(this.selectedAlbum);
    });
  }

  setCover(photo: any): void {
    const fd = new FormData();
    fd.append('titre', this.selectedAlbum.titre);
    fd.append('date', this.selectedAlbum.date || '');
    fd.append('couvertureUrl', photo.src);

    this.api.updateAlbumCover(this.selectedAlbum.id, photo.src).subscribe(() => {
      this.selectedAlbum.couverture = photo.src;
    });
  }

  deletePhoto(p: any): void {
    if (confirm('Supprimer cette photo ?'))
      this.api.deletePhoto(this.selectedAlbum.id, p.id).subscribe(() => this.openAlbum(this.selectedAlbum));
  }
}
