import { TestBed, inject } from '@angular/core/testing';

import { CmdChnService } from './cmd-chn.service';

describe('CmdChnService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CmdChnService]
    });
  });

  it('should be created', inject([CmdChnService], (service: CmdChnService) => {
    expect(service).toBeTruthy();
  }));
});
