import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitPhaseComponent } from './init-phase.component';

describe('InitPhaseComponent', () => {
  let component: InitPhaseComponent;
  let fixture: ComponentFixture<InitPhaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InitPhaseComponent]
    });
    fixture = TestBed.createComponent(InitPhaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
