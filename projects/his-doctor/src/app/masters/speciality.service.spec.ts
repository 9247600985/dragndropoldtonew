/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SpecialityService } from './speciality.service';

describe('Service: Speciality', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpecialityService]
    });
  });

  it('should ...', inject([SpecialityService], (service: SpecialityService) => {
    expect(service).toBeTruthy();
  }));
});
