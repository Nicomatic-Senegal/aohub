import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyPhaseComponent } from './study-phase.component';

describe('StudyPhaseComponent', () => {
  let component: StudyPhaseComponent;
  let fixture: ComponentFixture<StudyPhaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudyPhaseComponent]
    });
    fixture = TestBed.createComponent(StudyPhaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
