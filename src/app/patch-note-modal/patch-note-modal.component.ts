import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-patch-note-modal',
  standalone: false,
  templateUrl: './patch-note-modal.component.html',
  styleUrl: './patch-note-modal.component.css'
})
export class PatchNoteModalComponent {
  @Input() currentTime: string = '';
  @Input() puccaToDisplay: any;

  openModal() {
    const modal = new (window as any).bootstrap.Modal(document.getElementById('puccaModal'));
    modal.show();
  }

  closeModal() {
    const modal = new (window as any).bootstrap.Modal(document.getElementById('puccaModal'));
    modal.hide();
  }
}
