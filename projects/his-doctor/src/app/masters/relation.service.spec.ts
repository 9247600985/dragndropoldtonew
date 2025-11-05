/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RelationService } from './relation.service';

describe('Service: Relation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RelationService]
    });
  });

  it('should ...', inject([RelationService], (service: RelationService) => {
    expect(service).toBeTruthy();
  }));
});
