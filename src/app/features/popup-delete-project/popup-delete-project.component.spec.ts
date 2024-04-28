import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupDeleteProjectComponent } from './popup-delete-project.component';

describe('PopupDeleteProjectComponent', () => {
  let component: PopupDeleteProjectComponent;
  let fixture: ComponentFixture<PopupDeleteProjectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupDeleteProjectComponent]
    });
    fixture = TestBed.createComponent(PopupDeleteProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
