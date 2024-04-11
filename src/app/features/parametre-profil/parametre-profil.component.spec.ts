import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametreProfilComponent } from './parametre-profil.component';

describe('ParametreProfilComponent', () => {
  let component: ParametreProfilComponent;
  let fixture: ComponentFixture<ParametreProfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParametreProfilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParametreProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
