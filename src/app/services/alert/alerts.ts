import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlertsService {
  private alertSubject = new BehaviorSubject<any>(null); 
  alert$ = this.alertSubject.asObservable(); 

  show(message: string, type:'message'|'error'|'info' = 'info'){
    this.alertSubject.next({
      message, 
      type,
      mode: 'toast'
    });
    setTimeout(()=>this.clear(), 2000);
  }

  confirm(message: string, onConfim: ()=> void){
    this.alertSubject.next({
      message, 
      type: 'info', 
      mode: 'confirm', 
      onConfim
    });
  }

  clear() {
    this.alertSubject.next(null);
  }
}
