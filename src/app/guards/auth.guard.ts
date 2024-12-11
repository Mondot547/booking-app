import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/employees'; // URL de l'API backend

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<{ token: string; user: any }>(`${this.apiUrl}/login`, credentials).pipe(
      map((response) => {
        this.saveToken(response.token); // Sauvegarder le token JWT
        localStorage.setItem('user', JSON.stringify(response.user)); // Sauvegarder l'utilisateur
        return response.user;
      })
    );
  }

  saveToken(token: string): void {
    localStorage.setItem('authToken', token); // Stocker le token JWT
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
