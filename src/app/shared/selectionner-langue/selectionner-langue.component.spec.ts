import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionnerLangueComponent } from './selectionner-langue.component';

describe('SelectionnerLangueComponent', () => {
  let component: SelectionnerLangueComponent;
  let fixture: ComponentFixture<SelectionnerLangueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectionnerLangueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectionnerLangueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
