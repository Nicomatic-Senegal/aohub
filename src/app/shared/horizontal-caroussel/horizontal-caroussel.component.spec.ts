import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalCarousselComponent } from './horizontal-caroussel.component';

describe('HorizontalCarousselComponent', () => {
  let component: HorizontalCarousselComponent;
  let fixture: ComponentFixture<HorizontalCarousselComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HorizontalCarousselComponent]
    });
    fixture = TestBed.createComponent(HorizontalCarousselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
