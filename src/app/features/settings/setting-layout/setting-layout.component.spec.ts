import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingLayoutComponent } from './setting-layout.component';

describe('ParametresComponent', () => {
  let component: SettingLayoutComponent;
  let fixture: ComponentFixture<SettingLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
