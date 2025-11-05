import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay, first, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CachingInterceptorService implements HttpInterceptor {

  public readonly store: Record<string, Observable<HttpEvent<any>>> = {};

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let requireCache = req.headers.get('requireCache') && req.headers.get('requireCache') === 'true';
    // Don't cache if it's not cacheable
    if ( req.method !== 'GET' || !requireCache) {
      return next.handle(req);
    }

    // Check if observable is in cache, otherwise call next.handle
    const cachedObservable = this.store[req.urlWithParams] ||
      ( this.store[req.urlWithParams] = next.handle(req).pipe(
          // Filter since we are interested in caching the response only, not progress events
          filter((res) => res instanceof HttpResponse ),
          // Share replay will cache the response
          shareReplay(1),
      ));
    // pipe first() to cause the observable to complete after it emits the response
    // This mimics the behaviour of Observables returned by Angular's httpClient.get() 
    // And also makes toPromise work since toPromise will wait until the observable completes.
    return cachedObservable.pipe(first());
  }
}