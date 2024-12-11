import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth'; // URL de votre backend

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // Méthode pour se connecter
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // Stocker le token et les informations de l'utilisateur
        this.saveToken(response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
      })
    );
  }

  register(user: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user); // URL corrigée
  }
  

  // Méthode pour sauvegarder le token
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Méthode pour obtenir le token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Méthode pour vérifier si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Méthode pour obtenir l'utilisateur actuel
  getCurrentUser(): any {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Méthode de déconnexion
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}