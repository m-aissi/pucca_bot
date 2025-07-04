import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatchNoteModalComponent } from './patch-note-modal.component';

describe('PatchNoteModalComponent', () => {
  let component: PatchNoteModalComponent;
  let fixture: ComponentFixture<PatchNoteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatchNoteModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatchNoteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
