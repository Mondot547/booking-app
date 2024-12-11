import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.sass'
})
export class DashboardComponent implements OnInit {
  userName: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser(); // Utilisez getCurrentUser() ici
    if (user) {
      this.userName = user.name; // Affiche le nom de l'utilisateur
    } else {
      this.router.navigate(['/login']); // Redirige si l'utilisateur n'est pas connecté
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}