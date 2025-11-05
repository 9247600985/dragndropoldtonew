/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DialogPopupService } from './dialog-popup.service';

describe('Service: DialogPopup', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DialogPopupService]
    });
  });

  it('should ...', inject([DialogPopupService], (service: DialogPopupService) => {
    expect(service).toBeTruthy();
  }));
});
