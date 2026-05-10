import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // ─── Dashboard ───
  getStats(): Observable<any> { return this.http.get(`${this.base}/dashboard/stats`); }

  // ─── Dirigeants ───
  getDirigeants(): Observable<any[]> { return this.http.get<any[]>(`${this.base}/dirigeants`); }
  getDirigeant(id: number): Observable<any> { return this.http.get(`${this.base}/dirigeants/${id}`); }
  createDirigeant(data: FormData): Observable<any> { return this.http.post(`${this.base}/dirigeants`, data); }
  updateDirigeant(id: number, data: FormData): Observable<any> { return this.http.put(`${this.base}/dirigeants/${id}`, data); }
  deleteDirigeant(id: number): Observable<any> { return this.http.delete(`${this.base}/dirigeants/${id}`); }

  // ─── Entraineurs ───
  getEntraineurs(): Observable<any[]> { return this.http.get<any[]>(`${this.base}/entraineurs`); }
  getEntraineur(id: number): Observable<any> { return this.http.get(`${this.base}/entraineurs/${id}`); }
  createEntraineur(data: FormData): Observable<any> { return this.http.post(`${this.base}/entraineurs`, data); }
  updateEntraineur(id: number, data: FormData): Observable<any> { return this.http.put(`${this.base}/entraineurs/${id}`, data); }
  deleteEntraineur(id: number): Observable<any> { return this.http.delete(`${this.base}/entraineurs/${id}`); }

  // ─── Actualités ───
  getActualites(): Observable<any[]> { return this.http.get<any[]>(`${this.base}/actualites`); }
  getActualite(id: number): Observable<any> { return this.http.get(`${this.base}/actualites/${id}`); }
  createActualite(data: FormData): Observable<any> { return this.http.post(`${this.base}/actualites`, data); }
  updateActualite(id: number, data: FormData): Observable<any> { return this.http.put(`${this.base}/actualites/${id}`, data); }
  deleteActualite(id: number): Observable<any> { return this.http.delete(`${this.base}/actualites/${id}`); }

  // ─── Congés ───
  getConges(): Observable<any[]> { return this.http.get<any[]>(`${this.base}/conges`); }
  createConge(data: any): Observable<any> { return this.http.post(`${this.base}/conges`, data); }
  updateConge(id: number, data: any): Observable<any> { return this.http.put(`${this.base}/conges/${id}`, data); }
  deleteConge(id: number): Observable<any> { return this.http.delete(`${this.base}/conges/${id}`); }

  // ─── Albums ───
  getAlbums(): Observable<any[]> { return this.http.get<any[]>(`${this.base}/albums`); }
  getAlbum(id: number): Observable<any> { return this.http.get(`${this.base}/albums/${id}`); }
  createAlbum(data: FormData): Observable<any> { return this.http.post(`${this.base}/albums`, data); }
  updateAlbum(id: number, data: FormData): Observable<any> { return this.http.put(`${this.base}/albums/${id}`, data); }
  deleteAlbum(id: number): Observable<any> { return this.http.delete(`${this.base}/albums/${id}`); }
  addPhotos(albumId: number, data: FormData): Observable<any> { return this.http.post(`${this.base}/albums/${albumId}/photos`, data); }
  deletePhoto(albumId: number, photoId: number): Observable<any> { return this.http.delete(`${this.base}/albums/${albumId}/photos/${photoId}`); }

  // ─── Helper ───
  getImageUrl(path: string): string { return path ? `http://localhost:8080${path}` : ''; }
}
