import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AlertData {
  message: string;
  type: 'message' | 'error' | 'info';
  mode: 'toast' | 'confirm';
}

@Injectable({
  providedIn: 'root',
})
export class AlertsService {
  private alertSubject = new BehaviorSubject<AlertData | null>(null);
  alert$ = this.alertSubject.asObservable();

  private confirmResolve: ((value: boolean) => void) | null = null;

  show(message: string, type: 'message' | 'error' | 'info' = 'info', duration: number = 2000) {
    this.alertSubject.next({ message, type, mode: 'toast' });
    setTimeout(() => { this.clear(); }, duration);
  }

  confirm(message: string): Promise<boolean> {
    this.alertSubject.next({
      message,
      type: 'info',
      mode: 'confirm'
    });
    return new Promise<boolean>((resolve) => {
      this.confirmResolve = resolve;
    });
  }

  setConfirmResult(result: boolean) {
    if (this.confirmResolve) {
      this.confirmResolve(result);
      this.confirmResolve = null;  
    }
    this.clear();
  }

  clear() {
    this.alertSubject.next(null);
  }
}