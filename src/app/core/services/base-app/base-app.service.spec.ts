import { TestBed } from '@angular/core/testing';

import { BaseAppService } from './base-app.service';

describe('BaseAppService', () => {
  let service: BaseAppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseAppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
