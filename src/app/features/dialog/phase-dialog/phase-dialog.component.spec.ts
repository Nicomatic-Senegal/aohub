import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseDialogComponent } from './phase-dialog.component';

describe('PreSalesComponent', () => {
  let component: PhaseDialogComponent;
  let fixture: ComponentFixture<PhaseDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhaseDialogComponent]
    });
    fixture = TestBed.createComponent(PhaseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
