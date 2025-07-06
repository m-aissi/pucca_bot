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

  sendMessage(){
    
  }

}
