import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UrlInterceptor implements HttpInterceptor
{

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    req = req.clone({ url: this.getUrl(req.url)});
    
    return next.handle(req);

  }
  getUrl(url:string){
    let contextPath;
    /*if(environment.loadbalancer && environment.loadbalancer.length > 0){
      contextPath = environment.loadbalancer[(Math.floor(Math.random() * environment.loadbalancer.length))];      
    }else{*/
      contextPath = environment.appcontextpath;      
   // }
    if(contextPath && url.indexOf('assets') === -1)
        url = environment.appRoot+contextPath+url;
      return url;  
  }

}