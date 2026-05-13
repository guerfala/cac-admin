import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-entraineurs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">Entraîneurs</h1>
        <p class="page-subtitle">Gérer l'encadrement technique</p>
      </div>
      <button class="btn btn-primary" (click)="openCreate()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Ajouter
      </button>
    </div>

    <div class="card">
      <table class="data-table">
        <thead><tr><th>Photo</th><th>Nom</th><th>Spécialité</th><th>Ordre</th><th>Actions</th></tr></thead>
        <tbody>
          <tr *ngFor="let item of items">
            <td>
              <img *ngIf="item.photo" [src]="api.getImageUrl(item.photo)" class="table-photo" />
              <div *ngIf="!item.photo" class="table-photo" style="background:#f1f5f9;display:flex;align-items:center;justify-content:center;font-weight:600;color:#94a3b8;">{{ item.nom.charAt(0) }}</div>
            </td>
            <td style="font-weight:600;color:#1e293b;">{{ item.nom }}</td>
            <td>{{ item.specialite }}</td>
            <td>{{ item.ordre }}</td>
            <td><div class="table-actions">
              <button class="btn-icon edit" (click)="openEdit(item)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
              <button class="btn-icon delete" (click)="delete(item)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>
            </div></td>
          </tr>
        </tbody>
      </table>
      <p *ngIf="items.length === 0" style="text-align:center;color:#94a3b8;padding:40px;">Aucun entraîneur.</p>
    </div>

    <div class="modal-overlay" *ngIf="showModal" (click)="showModal=false">
      <div class="modal" (click)="$event.stopPropagation()">
        <h2 class="modal-title">{{ editing ? 'Modifier' : 'Ajouter' }} un entraîneur</h2>
        <div class="form-group"><label>Nom</label><input type="text" [(ngModel)]="form.nom" /></div>
        <div class="form-group"><label>Spécialité</label><input type="text" [(ngModel)]="form.specialite" placeholder="Sprint & Haies" /></div>
        <div class="form-group"><label>Ordre</label><input type="number" [(ngModel)]="form.ordre" /></div>
        <div class="form-group">
          <label>Photo</label>
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
export class EntraineursPage implements OnInit {
  items: any[] = [];
  showModal = false;
  editing = false;
  form: any = {};
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(public api: ApiService, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void { this.load(); }
  load(): void { this.api.getEntraineurs().subscribe(data => {
    this.items = data;
    this.cdr.detectChanges();   // ← ajouter
  }); }

  openCreate(): void { this.editing = false; this.form = { nom: '', specialite: '', ordre: this.items.length + 1 }; this.selectedFile = null; this.previewUrl = null; this.showModal = true; }
  openEdit(item: any): void { this.editing = true; this.form = { ...item }; this.selectedFile = null; this.previewUrl = item.photo ? this.api.getImageUrl(item.photo) : null; this.showModal = true; }

  onFileChange(e: Event): void { const f = (e.target as HTMLInputElement).files?.[0]; if (f) { this.selectedFile = f; this.previewUrl = URL.createObjectURL(f); } }

  save(): void {
    const fd = new FormData();
    fd.append('nom', this.form.nom);
    fd.append('specialite', this.form.specialite);
    if (this.form.ordre != null) fd.append('ordre', this.form.ordre.toString());
    if (this.selectedFile) fd.append('photo', this.selectedFile);
    (this.editing ? this.api.updateEntraineur(this.form.id, fd) : this.api.createEntraineur(fd))
      .subscribe(() => { this.showModal = false; this.load(); });
  }

  delete(item: any): void { if (confirm(`Supprimer ${item.nom} ?`)) this.api.deleteEntraineur(item.id).subscribe(() => this.load()); }
}
