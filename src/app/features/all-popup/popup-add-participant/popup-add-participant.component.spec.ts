import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupAddParticipantComponent } from './popup-add-participant.component';

describe('PopupAddParticipantComponent', () => {
  let component: PopupAddParticipantComponent;
  let fixture: ComponentFixture<PopupAddParticipantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupAddParticipantComponent]
    });
    fixture = TestBed.createComponent(PopupAddParticipantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
