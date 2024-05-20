import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndustrializationPhaseComponent } from './industrialization-phase.component';

describe('IndustrializationPhaseComponent', () => {
  let component: IndustrializationPhaseComponent;
  let fixture: ComponentFixture<IndustrializationPhaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndustrializationPhaseComponent]
    });
    fixture = TestBed.createComponent(IndustrializationPhaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
