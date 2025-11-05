import { HttpRequest, HttpHandler, HttpInterceptor, HTTP_INTERCEPTORS, HttpResponse, HttpClient } from "@angular/common/http";
import { Injector, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject, Observable, throwError } from "rxjs";
import { catchError, switchMap, tap} from "rxjs/operators";

import { DeviceUtil } from "../utils/DeviceUtil";
import { LoaderService } from "../loader/loader.service";
import { BusyIndicator } from "./busy-indicator";
import { UrlInterceptor } from "./url-interceptor";
import { RetryInterceptorService } from "./retry-interceptor";
import { NativeInterceptor } from "./native-interceptor";
import { ToastComponent } from "../toast/toast.component";
import { CachingInterceptorService } from "./caching-interceptor.service";
import { environment } from "../../environments/environment";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    
    gateway:HttpClient;
    refreshTokenInProgress = false;

    tokenRefreshedSource = new Subject();
    tokenRefreshed$ = this.tokenRefreshedSource.asObservable();

    constructor(private injector: Injector, private router: Router, private deviceUtil:DeviceUtil, private loader: LoaderService, private toast:ToastComponent) {}

    addAuthHeader(request:any) {
        let authHeader = this.getAuthorizationHeader();
        if (authHeader) {
            return request.clone({
                setHeaders: {
                    "Authorization": authHeader
                }
            });
        }
        return request;
    }

    refreshToken(): Observable<any> {
        if (this.refreshTokenInProgress) {
            return new Observable(observer => {
                this.tokenRefreshed$.subscribe(() => {
                    observer.next();
                    observer.complete();
                });
            });
        } else {
            this.refreshTokenInProgress = true;

            return this.reAuthToken().pipe(
                tap((data) => {
                    this.refreshTokenInProgress = false;
                    this.tokenRefreshedSource.next(data);
                }));
        }
    }

    logout() {
        this.logoff();
        this.router.navigate(["login"]);
    }

    handleResponseError(error:any, request:any, next:any):any {
        // Business error
        if (error.status === 400) {
            // Show message
        }

        // Invalid token error
        else if (error.status === 401) {
            return this.refreshToken().pipe(
                switchMap(() => {
                    request = this.addAuthHeader(request);
                    return next.handle(request);
                }),
                catchError(e => {
                    if (e.status !== 401) {
                        return this.handleResponseError(e, request, next);
                    } else {
                        this.logout();
                    }
                }));
        }

        // Access denied error
        else if (error.status === 403) {
            // Show message
            // Logout
            this.logout();
        }

        // Server error
        else if (error.status === 500) {
            if(error.error.toString().toLowerCase().startsWith('Error occured while trying to proxy'.toLowerCase()))
                this.toast.showError("Server connectivity problem.");
            // Show message
        }

        // Maintenance error
        else if (error.status === 503) {
            // Show message
            // Redirect to the maintenance page
        }

        return throwError(error);
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        
        // Handle request
        request = this.addAuthHeader(request);
            return next.handle(request).pipe(catchError(error => {
                return this.handleResponseError(error, request, next);
            }));            
    }    
      reAuthToken<T>(){
        let observable = new Observable<T>(observer => {
          let token;
            let tokenData = this.deviceUtil.getSessionData("TokenInfo");
            if(tokenData)
              token = tokenData.refresh_token;
            if(!this.gateway)
              this.gateway = this.injector.get(HttpClient);
            let body:string = "refresh_token="+token;    
            body += "&grant_type=refresh_token"
            body += "&client_id="+ environment.clientId;
            body += "&client_secret="+ environment.clientSecret;
            this.gateway.post<any>('/oauth/token', body, this.deviceUtil.getUrlHeaders()).subscribe((result:any)=>{
            tokenData.access_token = result.access_token;
            tokenData.expires_in = result.expires_in;
            tokenData.refresh_token = result.refresh_token;
            this.deviceUtil.addSessionData("TokenInfo", tokenData);
            observer.next(result);
            observer.complete();
          });
        });
        return observable;
      }
      getAuthorizationHeader(){
        let token;
        let tokenData = this.deviceUtil.getSessionData("TokenInfo");
        if(tokenData)
          token = tokenData.access_token;
        return 'Bearer ' +token;
      }
      logoff(){
        this.deviceUtil.logout();
      }
}

export const AuthInterceptorProvider = [    
    { provide: HTTP_INTERCEPTORS, useClass: BusyIndicator, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: UrlInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptorService, multi: true },
    {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
},
//{ provide: HTTP_INTERCEPTORS, useClass: NativeInterceptor, multi: true }//,
//{ provide: HTTP_INTERCEPTORS, useClass: RetryInterceptorService, multi: true }
];