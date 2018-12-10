// STEP 1:
// Copy this code into services/http-interceptor.ts
// Then in your app.module.ts file import this:
//
// import { IdentityVaultInterceptor } from '../services/http-interceptor';
//
// Then make sure to include it in the 'imports' of your app.module.ts as well:
//
// imports: [
//   ...,
//   IdentityVaultInterceptor
// ]
//
// Then follow along with steps 2-4 in this code.

import { Injectable, NgModule} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// STEP 2:
// Import your user service here.
import { User } from './user';

@Injectable()
export class IdentityVaultHttpInterceptor implements HttpInterceptor {

    // STEP 3:
    // Change "User" to your user service here.
    constructor(public user: User) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (this.user.token) {
            req = req.clone({

                // STEP 4:
                // Set the header and value that you need to pass here.
                // this.user represents your entire user service.
                setHeaders: {
                    'Authorization': 'Bearer '+this.user.token
                }
            });
        }

        return next.handle(req).do((event: HttpEvent<any>) => {}, (err: any) => {
            if (err instanceof HttpErrorResponse && err.status === 401){
                // We got back an unauthorized response, we might want to redirect the user
                // back to our login page or show them an error


            }
        });

    }

};

@NgModule({
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: IdentityVaultHttpInterceptor, multi: true }
    ]
})
export class IdentityVaultInterceptor { }