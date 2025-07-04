import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-patch-note-modal',
  standalone: false,
  templateUrl: './patch-note-modal.component.html',
  styleUrl: './patch-note-modal.component.css'
})
export class PatchNoteModalComponent {
  constructor(private dialog: MatDialog) {}

  openModal() {
    this.dialog.open(PatchNoteModalComponent, {
      width: '500px',
      data: {
        // Tu peux passer des données ici si besoin
        title: 'Patch Note v1.2'
      }
    });
  }
}
