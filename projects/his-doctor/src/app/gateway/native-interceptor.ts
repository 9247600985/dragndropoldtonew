import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpResponse
} from "@angular/common/http";
import { Observable, of } from "rxjs";
import { environment } from "../../environments/environment";
declare var NativeGateway: any;
@Injectable({
  providedIn: 'root'
})
export class NativeInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {    
    /*let isAvail = NativeGateway.isAvailable();
    if(isAvail){
      return this.addObservable(new HttpResponse(JSON.parse(NativeGateway.invokeHttp(environment.appServiceUrl, req))));
    }*/
    return next.handle(req)
  }
  addObservable<T>(message:any){
    let observable = new Observable<T>(observer => {
      if(message.error){
        observer.error(message);
      }else{
          observer.next(message);
          observer.complete();
      }
      
    });
    return observable;
  }
}
