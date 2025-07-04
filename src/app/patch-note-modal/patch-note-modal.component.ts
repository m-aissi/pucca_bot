import { Component } from '@angular/core';

@Component({
  selector: 'app-patch-note-modal',
  standalone: false,
  templateUrl: './patch-note-modal.component.html',
  styleUrl: './patch-note-modal.component.css'
})
export class PatchNoteModalComponent {
  ngOnInit() {
    const myModal = document.getElementById('myModal')
    const myInput = document.getElementById('myInput');
  
    if (myModal && myInput) {
      myModal.addEventListener('shown.bs.modal', () => {
        myInput.focus();
      });
    }
  }

}
