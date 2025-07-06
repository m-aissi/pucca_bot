import { Component, Input, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-patch-note-modal',
  standalone: false,
  templateUrl: './patch-note-modal.component.html',
  styleUrl: './patch-note-modal.component.css'
})
export class PatchNoteModalComponent implements OnInit, AfterViewInit {
  @Input() currentTime: string = '';
  @Input() puccaToDisplay: any;
  
  isListVisible: boolean = true;

  ngOnInit() {
    // Initialisation
  }

  ngAfterViewInit() {
    // Gérer l'animation du chevron avec Bootstrap collapse
    const collapseElement = document.getElementById('collapseExample');
    const chevronIcon = document.querySelector('.chevron-icon');
    
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
    const modal = new (window as any).bootstrap.Modal(document.getElementById('puccaModal'));
    modal.show();
  }

  closeModal() {
    const modal = new (window as any).bootstrap.Modal(document.getElementById('puccaModal'));
    modal.hide();
  }

  toggleList() {
    this.isListVisible = !this.isListVisible;
  }
}
