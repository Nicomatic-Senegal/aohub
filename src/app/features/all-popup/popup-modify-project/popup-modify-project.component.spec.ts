import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupModifyProjectComponent } from './popup-modify-project.component';

describe('PopupModifyProjectComponent', () => {
  let component: PopupModifyProjectComponent;
  let fixture: ComponentFixture<PopupModifyProjectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupModifyProjectComponent]
    });
    fixture = TestBed.createComponent(PopupModifyProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
