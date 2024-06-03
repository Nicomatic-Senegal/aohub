import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdDeploymentPhaseComponent } from './prod-deployment-phase.component';

describe('ProdDeploymentPhaseComponent', () => {
  let component: ProdDeploymentPhaseComponent;
  let fixture: ComponentFixture<ProdDeploymentPhaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProdDeploymentPhaseComponent]
    });
    fixture = TestBed.createComponent(ProdDeploymentPhaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
