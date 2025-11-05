/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CachingInterceptorService } from './caching-interceptor.service';

describe('Service: CachingInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CachingInterceptorService]
    });
  });

  it('should ...', inject([CachingInterceptorService], (service: CachingInterceptorService) => {
    expect(service).toBeTruthy();
  }));
});
