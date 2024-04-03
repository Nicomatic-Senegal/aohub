import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalCarousselComponent } from './vertical-caroussel.component';

describe('VerticalCarousselComponent', () => {
  let component: VerticalCarousselComponent;
  let fixture: ComponentFixture<VerticalCarousselComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerticalCarousselComponent]
    });
    fixture = TestBed.createComponent(VerticalCarousselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
