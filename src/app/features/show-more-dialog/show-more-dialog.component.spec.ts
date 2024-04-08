import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMoreDialogComponent } from './show-more-dialog.component';

describe('ShowMoreDialogComponent', () => {
  let component: ShowMoreDialogComponent;
  let fixture: ComponentFixture<ShowMoreDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowMoreDialogComponent]
    });
    fixture = TestBed.createComponent(ShowMoreDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
