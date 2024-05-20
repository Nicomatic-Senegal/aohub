import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametreNotificationComponent } from './parametre-notification.component';

describe('ParametreNotificationComponent', () => {
  let component: ParametreNotificationComponent;
  let fixture: ComponentFixture<ParametreNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParametreNotificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParametreNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
