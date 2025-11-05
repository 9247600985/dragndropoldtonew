import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { DeviceUtil } from '../utils/DeviceUtil';
@Injectable()
export class ServiceIntercept implements HttpInterceptor{
    publicUrl:string = '/auth';
    private AUTH_HEADER = "Authorization";
    private token = '';
    constructor(private deviceUtil:DeviceUtil){}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token:any = 'ERTYU';//localStorage.getItem('token');
        let tokenData = this.deviceUtil.getSessionData("TokenInfo");
        if(tokenData)
            token = tokenData.access_token;
        if (token) {
            request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
        }

        if (!request.headers.has('Content-Type')) {
            request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        }

        request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

        return next.handle(request);
    }
}
