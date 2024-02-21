import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametreMotDePasseComponent } from './parametre-mot-de-passe.component';

describe('ParametreMotDePasseComponent', () => {
  let component: ParametreMotDePasseComponent;
  let fixture: ComponentFixture<ParametreMotDePasseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParametreMotDePasseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParametreMotDePasseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
