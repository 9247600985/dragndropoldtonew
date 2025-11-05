/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DesignContainerService } from './design-container.service';

describe('Service: DesignContainer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DesignContainerService]
    });
  });

  it('should ...', inject([DesignContainerService], (service: DesignContainerService) => {
    expect(service).toBeTruthy();
  }));
});
