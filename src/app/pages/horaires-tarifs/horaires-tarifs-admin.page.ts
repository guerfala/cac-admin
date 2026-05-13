import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-horaires-tarifs-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <div><h1 class="page-title">Horaires & Tarifs</h1><p class="page-subtitle">Gérer la saison, les catégories et les prix</p></div>
    </div>

    <!-- ─── SAISON ─── -->
    <div class="card" style="margin-bottom:24px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <h3 style="font-size:16px;font-weight:600;color:#1e293b;">Saison en cours</h3>
          <p style="font-size:13px;color:#94a3b8;margin-top:4px;">Affiché sur la page Horaires & Tarifs du site</p>
        </div>
        <div style="display:flex;align-items:center;gap:12px;">
          <input type="text" [(ngModel)]="saison" placeholder="25/26"
                 style="width:100px;padding:10px 14px;border:1px solid #e2e8f0;border-radius:8px;font-size:16px;font-weight:600;text-align:center;font-family:'Outfit',sans-serif;" />
          <button class="btn btn-primary" (click)="saveSaison()">Enregistrer</button>
        </div>
      </div>
      <div *ngIf="saisonSaved" style="color:#10b981;font-size:13px;margin-top:8px;">✅ Saison mise à jour</div>
    </div>

    <!-- ─── CATÉGORIES HORAIRES ─── -->
    <div class="card" style="margin-bottom:24px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
        <h3 style="font-size:16px;font-weight:600;color:#1e293b;">Catégories & Horaires</h3>
        <button class="btn btn-primary btn-sm" (click)="openCreateCat()">+ Ajouter</button>
      </div>

      <table class="data-table">
        <thead><tr><th>#</th><th>Catégorie</th><th>Horaires</th><th>Actions</th></tr></thead>
        <tbody>
          <tr *ngFor="let c of categories">
            <td>{{ c.ordre }}</td>
            <td style="font-weight:600;color:#1e293b;">{{ c.nom }}</td>
            <td style="max-width:400px;">
              <div *ngFor="let h of getHoraires(c.horaires)" style="font-size:13px;color:#64748b;padding:2px 0;">
                • {{ h }}
              </div>
            </td>
            <td><div class="table-actions">
              <button class="btn-icon edit" (click)="openEditCat(c)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
              <button class="btn-icon delete" (click)="deleteCat(c)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>
            </div></td>
          </tr>
        </tbody>
      </table>
      <p *ngIf="categories.length === 0" style="text-align:center;color:#94a3b8;padding:24px;">Aucune catégorie.</p>
    </div>

    <!-- ─── TARIFS ─── -->
    <div class="card" style="margin-bottom:24px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
        <h3 style="font-size:16px;font-weight:600;color:#1e293b;">Tarifs</h3>
        <button class="btn btn-primary btn-sm" (click)="openCreateTarif()">+ Ajouter</button>
      </div>

      <table class="data-table">
        <thead><tr><th>Catégorie</th><th>Cotisation</th><th>Licence</th><th>Total</th><th>Actions</th></tr></thead>
        <tbody>
          <tr *ngFor="let t of tarifs">
            <td style="font-weight:600;color:#1e293b;">{{ t.categorie }}</td>
            <td>{{ t.cotisation }}</td>
            <td>{{ t.licence }}</td>
            <td style="font-weight:600;color:#efb01f;">{{ t.total }}</td>
            <td><div class="table-actions">
              <button class="btn-icon edit" (click)="openEditTarif(t)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
              <button class="btn-icon delete" (click)="deleteTarif(t)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>
            </div></td>
          </tr>
        </tbody>
      </table>
      <p *ngIf="tarifs.length === 0" style="text-align:center;color:#94a3b8;padding:24px;">Aucun tarif.</p>
    </div>

    <!-- ─── NOTE TARIFS ─── -->
    <div class="card">
      <h3 style="font-size:16px;font-weight:600;color:#1e293b;margin-bottom:12px;">Note tarifs</h3>
      <div style="display:flex;gap:12px;">
        <input type="text" [(ngModel)]="tarifsNote" style="flex:1;padding:10px 14px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;font-family:'Outfit',sans-serif;" />
        <button class="btn btn-primary" (click)="saveNote()">Enregistrer</button>
      </div>
      <div *ngIf="noteSaved" style="color:#10b981;font-size:13px;margin-top:8px;">✅ Note mise à jour</div>
    </div>

    <!-- ─── MODAL CATÉGORIE ─── -->
    <div class="modal-overlay" *ngIf="showCatModal" (click)="showCatModal=false">
      <div class="modal" (click)="$event.stopPropagation()">
        <h2 class="modal-title">{{ editingCat ? 'Modifier' : 'Ajouter' }} une catégorie</h2>
        <div class="form-group"><label>Nom de la catégorie</label><input type="text" [(ngModel)]="catForm.nom" placeholder="Baby Athlé" /></div>
        <div class="form-group">
          <label>Horaires (un horaire par ligne)</label>
          <textarea [(ngModel)]="catForm.horaires" rows="5" placeholder="4 ans — Mercredi de 13h30 à 14h30&#10;5 ans — Mercredi de 14h30 à 16h00"></textarea>
        </div>
        <div class="form-group"><label>Ordre d'affichage</label><input type="number" [(ngModel)]="catForm.ordre" /></div>
        <div class="form-actions">
          <button class="btn btn-secondary" (click)="showCatModal=false">Annuler</button>
          <button class="btn btn-primary" (click)="saveCat()">{{ editingCat ? 'Modifier' : 'Ajouter' }}</button>
        </div>
      </div>
    </div>

    <!-- ─── MODAL TARIF ─── -->
    <div class="modal-overlay" *ngIf="showTarifModal" (click)="showTarifModal=false">
      <div class="modal" (click)="$event.stopPropagation()">
        <h2 class="modal-title">{{ editingTarif ? 'Modifier' : 'Ajouter' }} un tarif</h2>
        <div class="form-group"><label>Catégorie</label><input type="text" [(ngModel)]="tarifForm.categorie" placeholder="Baby" /></div>
        <div class="form-group"><label>Cotisation</label><input type="text" [(ngModel)]="tarifForm.cotisation" placeholder="160 €" /></div>
        <div class="form-group"><label>Licence</label><input type="text" [(ngModel)]="tarifForm.licence" placeholder="70 €" /></div>
        <div class="form-group"><label>Total</label><input type="text" [(ngModel)]="tarifForm.total" placeholder="230 €" /></div>
        <div class="form-group"><label>Ordre</label><input type="number" [(ngModel)]="tarifForm.ordre" /></div>
        <div class="form-actions">
          <button class="btn btn-secondary" (click)="showTarifModal=false">Annuler</button>
          <button class="btn btn-primary" (click)="saveTarif()">{{ editingTarif ? 'Modifier' : 'Ajouter' }}</button>
        </div>
      </div>
    </div>
  `,
})
export class HorairesTarifsAdminPage implements OnInit {
  saison = '';
  saisonSaved = false;
  tarifsNote = '';
  noteSaved = false;

  categories: any[] = [];
  tarifs: any[] = [];

  showCatModal = false;
  editingCat = false;
  catForm: any = {};

  showTarifModal = false;
  editingTarif = false;
  tarifForm: any = {};

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.api.getSetting('saison').subscribe({ next: (s: any) => this.saison = s.valeur, error: () => this.saison = '25/26' });
    this.api.getSetting('tarifs_note').subscribe({ next: (s: any) => this.tarifsNote = s.valeur, error: () => {} });
    this.api.getCategories().subscribe(d => this.categories = d);
    this.api.getTarifs().subscribe(d => this.tarifs = d);
  }

  getHoraires(h: string): string[] {
    return h ? h.split('\n').filter(l => l.trim()) : [];
  }

  // ─── Saison ───
  saveSaison(): void {
    this.saisonSaved = false;
    this.api.updateSetting('saison', this.saison).subscribe(() => {
      this.saisonSaved = true;
      setTimeout(() => this.saisonSaved = false, 3000);
    });
  }

  saveNote(): void {
    this.noteSaved = false;
    this.api.updateSetting('tarifs_note', this.tarifsNote).subscribe(() => {
      this.noteSaved = true;
      setTimeout(() => this.noteSaved = false, 3000);
    });
  }

  // ─── Catégories ───
  openCreateCat(): void { this.editingCat = false; this.catForm = { nom: '', horaires: '', ordre: this.categories.length + 1 }; this.showCatModal = true; }
  openEditCat(c: any): void { this.editingCat = true; this.catForm = { ...c }; this.showCatModal = true; }

  saveCat(): void {
    (this.editingCat ? this.api.updateCategorie(this.catForm.id, this.catForm) : this.api.createCategorie(this.catForm))
      .subscribe(() => { this.showCatModal = false; this.loadAll(); });
  }

  deleteCat(c: any): void {
    if (confirm(`Supprimer "${c.nom}" ?`)) this.api.deleteCategorie(c.id).subscribe(() => this.loadAll());
  }

  // ─── Tarifs ───
  openCreateTarif(): void { this.editingTarif = false; this.tarifForm = { categorie: '', cotisation: '', licence: '', total: '', ordre: this.tarifs.length + 1 }; this.showTarifModal = true; }
  openEditTarif(t: any): void { this.editingTarif = true; this.tarifForm = { ...t }; this.showTarifModal = true; }

  saveTarif(): void {
    (this.editingTarif ? this.api.updateTarif(this.tarifForm.id, this.tarifForm) : this.api.createTarif(this.tarifForm))
      .subscribe(() => { this.showTarifModal = false; this.loadAll(); });
  }

  deleteTarif(t: any): void {
    if (confirm(`Supprimer le tarif "${t.categorie}" ?`)) this.api.deleteTarif(t.id).subscribe(() => this.loadAll());
  }
}
