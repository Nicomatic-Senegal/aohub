import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StopProjectDialogComponent } from './stop-project-dialog.component';

describe('FeasibilityPhaseComponent', () => {
  let component: StopProjectDialogComponent;
  let fixture: ComponentFixture<StopProjectDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StopProjectDialogComponent]
    });
    fixture = TestBed.createComponent(StopProjectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
