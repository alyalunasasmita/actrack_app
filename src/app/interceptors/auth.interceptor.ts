import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable, catchError, from, switchMap, throwError } from 'rxjs';
import { Authservices } from '../services/auth';
import { AlertsService } from '../services/alert/alerts';
import { NavController } from '@ionic/angular';





@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: Authservices, private alert: AlertsService
    , private navCtrl : NavController
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {

  if (req.url.includes('/login') || req.url.includes('/register')) {
    return next.handle(req);
  }

  return from(this.auth.getToken()).pipe(
    switchMap(token => {
      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      return next.handle(req).pipe(
        catchError((error) => {
          if (error.status === 0){
            this.alert.show('Tidak Ada Koneksi Internet')
          }
          if (error.status === 0){
            this.navCtrl.navigateForward('/login')
            console.log('Unauthorized')
          }
          return throwError(() => error);
        })
      )
    })
  );
}
}
    