import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dirigeants',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dirigeants.page.html',
})
export class DirigeantsPage implements OnInit {
  items: any[] = [];
  showModal = false;
  editing = false;
  form: any = { nom: '', role: '', ordre: 0 };
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(public api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.api.getDirigeants().subscribe(data => {
    this.items = data;
    this.cdr.detectChanges();   // ← ajouter
  });;
  }

  openCreate(): void {
    this.editing = false;
    this.form = { nom: '', role: '', ordre: this.items.length + 1 };
    this.selectedFile = null;
    this.previewUrl = null;
    this.showModal = true;
  }

  openEdit(item: any): void {
    this.editing = true;
    this.form = { ...item };
    this.selectedFile = null;
    this.previewUrl = item.photo ? this.api.getImageUrl(item.photo) : null;
    this.showModal = true;
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      this.previewUrl = URL.createObjectURL(file);
    }
  }

  save(): void {
    const fd = new FormData();
    fd.append('nom', this.form.nom);
    fd.append('role', this.form.role);
    if (this.form.ordre != null) fd.append('ordre', this.form.ordre.toString());
    if (this.selectedFile) fd.append('photo', this.selectedFile);

    const req = this.editing
      ? this.api.updateDirigeant(this.form.id, fd)
      : this.api.createDirigeant(fd);

    req.subscribe(() => {
      this.showModal = false;
      this.load();
    });
  }

  delete(item: any): void {
    if (confirm(`Supprimer ${item.nom} ?`)) {
      this.api.deleteDirigeant(item.id).subscribe(() => this.load());
    }
  }
}
