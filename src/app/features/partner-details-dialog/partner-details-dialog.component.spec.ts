import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerDetailsDialogComponent } from './partner-details-dialog.component';

describe('PartnerDetailsDialogComponent', () => {
  let component: PartnerDetailsDialogComponent;
  let fixture: ComponentFixture<PartnerDetailsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartnerDetailsDialogComponent]
    });
    fixture = TestBed.createComponent(PartnerDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
