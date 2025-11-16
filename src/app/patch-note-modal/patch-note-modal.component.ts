import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-patch-note-modal',
  standalone: false,
  templateUrl: './patch-note-modal.component.html',
  styleUrl: './patch-note-modal.component.css',
})
export class PatchNoteModalComponent implements OnInit, AfterViewInit {

  isFormValid: boolean = false;

  messageInput : string ='';
  contactInfoInput : string ='';
  contactInput: boolean = false;
  constructor(private http: HttpClient) {}
  confirmationMessage: string = '';
  ngOnInit() {
    // Initialisation
  }

  ngAfterViewInit() {
    const collapseElement = document.getElementById('collapseExample');
    const chevronIcon = document.getElementById('main-chevron');
  
    // Synchronise l'état initial
    if (collapseElement && chevronIcon && collapseElement.classList.contains('show')) {
      chevronIcon.classList.add('rotated');
    }
  
    if (collapseElement && chevronIcon) {
      collapseElement.addEventListener('show.bs.collapse', () => {
        chevronIcon.classList.add('rotated');
      });
  
      collapseElement.addEventListener('hide.bs.collapse', () => {
        chevronIcon.classList.remove('rotated');
      });
    }
  }

  openModal() {
    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('puccaModal')
    );
    modal.show();
  }

  closeModal() {
    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('puccaModal')
    );
    modal.hide();
  }


  // Appelle cette méthode à chaque changement
  updateFormValidity() {
    this.isFormValid = !!this.messageInput.length && (
      !this.contactInput || !!this.contactInfoInput.length
    );
  }

  // Handlers pour les changements de champs
  onMessageInputChange(newValue: string) {
    this.messageInput = newValue;
    this.updateFormValidity();
  }

  onContactInfoInputChange(newValue: string) {
    this.contactInfoInput = newValue;
    this.updateFormValidity();
  }

  onContactInputChange(newValue: boolean) {
    this.contactInput = newValue;
    this.updateFormValidity();
  }

  sendMessage() {
    const payload: any = {
      message: this.messageInput,
      date: new Date()
    };
    if (this.contactInput && this.contactInfoInput) {
      payload.contactInfo = this.contactInfoInput;
    }
  
    this.http.post('http://176.186.145.154:3000/api/msgToDev', payload)
      .subscribe({
        next: (res) => {
          this.confirmationMessage = 'Message envoyé avec succès !';
          // Réinitialise le formulaire
          this.messageInput = '';
          this.contactInput = false;
          this.contactInfoInput = '';
          this.updateFormValidity();
          // Efface le message après 3 secondes
          setTimeout(() => this.confirmationMessage = '', 3000);
        },
        error: (err) => {
          this.confirmationMessage = 'Erreur lors de l\'envoi du message.';
          setTimeout(() => this.confirmationMessage = '', 3000);
        }
      });
  }

}
