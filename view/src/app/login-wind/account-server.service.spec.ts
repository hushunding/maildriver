import { TestBed, inject } from '@angular/core/testing';

import { AccountServerService } from './account-server.service';

describe('AccountServerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountServerService]
    });
  });

  it('should be created', inject([AccountServerService], (service: AccountServerService) => {
    expect(service).toBeTruthy();
  }));
});
