import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isRegisterMode = false; // Mode par défaut : connexion
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Initialiser les formulaires
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Soumettre le formulaire de connexion
  onLogin(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (user) => {
          this.router.navigate(['/dashboard']); // Redirection vers le tableau de bord
        },
        error: (err) => {
          this.errorMessage = 'Identifiants incorrects. Veuillez réessayer.';
        }
      });
    }
  }

  // Soumettre le formulaire d'inscription
  onRegister(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          this.successMessage = 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.';
          this.isRegisterMode = false; // Basculer vers le mode connexion
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Erreur lors de la création du compte.';
        }
      });
    }
  }

  // Basculer entre connexion et inscription
  toggleMode(): void {
    this.isRegisterMode = !this.isRegisterMode;
    this.errorMessage = '';
    this.successMessage = '';
  }
}
