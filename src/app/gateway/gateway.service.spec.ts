/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GatewayService } from './gateway.service';

describe('Service: Gateway', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GatewayService]
    });
  });

  it('should ...', inject([GatewayService], (service: GatewayService) => {
    expect(service).toBeTruthy();
  }));
});
