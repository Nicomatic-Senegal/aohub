import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountResetInitComponent } from './account-reset-init.component';

describe('AccountResetInitComponent', () => {
  let component: AccountResetInitComponent;
  let fixture: ComponentFixture<AccountResetInitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountResetInitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountResetInitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
