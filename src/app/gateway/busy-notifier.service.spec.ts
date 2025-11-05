/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BusyNotifierService } from './busy-notifier.service';

describe('Service: BusyNotifier', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BusyNotifierService]
    });
  });

  it('should ...', inject([BusyNotifierService], (service: BusyNotifierService) => {
    expect(service).toBeTruthy();
  }));
});
