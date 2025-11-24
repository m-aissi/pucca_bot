import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-modal',
  standalone: false,
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.css'
})
export class LoginModalComponent implements OnInit, AfterViewInit {

  isFormValid: boolean = false;
  isRegistering: boolean = false;
  errorMsg: boolean = false;
  userNameInput: string = '';
  passwordInput: string = '';
  confirmPasswordInput: string = ''
  emailInput: string = '';

  isRegisterValid: boolean = false;

  constructor(private http: HttpClient, private auth: AuthService) {}
  ngOnInit() {
    // Initialisation
  }

  ngAfterViewInit() {
   
  }

  validateForm() {
    this.isFormValid = (this.userNameInput !== '' && this.passwordInput !== '');
  }

  validateRegister() {
    this.isRegisterValid = this.userNameInput !== '' && this.passwordInput !== ''&& (this.passwordInput === this.confirmPasswordInput);
  }
  openModal() {
    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('loginModal')
    );
    modal.show();
  }

  closeModal() {
    const modalElement = document.getElementById('loginModal');
    const modalInstance = (window as any).bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
  }

  displayRegister() {
    this.isRegistering = true;
  }

  diplsayLoggin() {
    this.isRegistering = false;
  }
  
  login() {
    console.log('login');
    this.http.post('http://176.186.145.154:3000/api/loggin', {
      username: this.userNameInput,
      password: this.passwordInput,
    }).subscribe({
      next: (res: any) => {
        const user = res?.body ?? res; // adapte selon le format de ta réponse
        this.auth.setUser(user);
        this.closeModal();
        

      },
      error: (err) => {
        this.errorMsg = true;
      }
    });
  }


    register() {
        console.log('register');
      this.http.post('http://176.186.145.154:3000/api/register', {
        username: this.userNameInput,
        password: this.passwordInput,
  
      }).subscribe({
        next: (res) => {
          //todo: logique après inscription réussie
        },
        error: (err) => {
          //todo : afficher la bonne erreur plus tard
        }
      });
    }
  // sendMessage() {
  //   const payload: any = {
  //     message: this.messageInput,
  //     date: new Date()
  //   };
  //   if (this.contactInput && this.contactInfoInput) {
  //     payload.contactInfo = this.contactInfoInput;
  //   }
  
  //   this.http.post('http://176.186.145.154:3000/api/msgToDev', payload)
  //     .subscribe({
  //       next: (res) => {
  //         this.confirmationMessage = 'Message envoyé avec succès !';
  //         // Réinitialise le formulaire
  //         this.messageInput = '';
  //         this.contactInput = false;
  //         this.contactInfoInput = '';
  //         this.updateFormValidity();
  //         // Efface le message après 3 secondes
  //         setTimeout(() => this.confirmationMessage = '', 3000);
  //       },
  //       error: (err) => {
  //         this.confirmationMessage = 'Erreur lors de l\'envoi du message.';
  //         setTimeout(() => this.confirmationMessage = '', 3000);
  //       }
  //     });
  // }

}
