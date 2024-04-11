import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterpriseDetailsDialogComponent } from './enterprise-details-dialog.component';

describe('EnterpriseDetailsDialogComponent', () => {
  let component: EnterpriseDetailsDialogComponent;
  let fixture: ComponentFixture<EnterpriseDetailsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnterpriseDetailsDialogComponent]
    });
    fixture = TestBed.createComponent(EnterpriseDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
