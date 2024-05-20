import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotDePasseOublieProcessusComponent } from './mot-de-passe-oublie-processus.component';

describe('MotDePasseOublieProcessusComponent', () => {
  let component: MotDePasseOublieProcessusComponent;
  let fixture: ComponentFixture<MotDePasseOublieProcessusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotDePasseOublieProcessusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotDePasseOublieProcessusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
