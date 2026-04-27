import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class NetworkServices {
  private status = new BehaviorSubject<boolean>(true); 
  isOnline$ = this.status.asObservable(); 

  constructor(){
    this.init(); 
  }

  async init(){
    const result = await Network.getStatus(); 
    this.status.next(result.connected);
    Network.addListener('networkStatusChange', (status) => {
      this.status.next(status.connected);
    }); 
  }

  async isOnline(): Promise<boolean> {
    const result = await Network.getStatus();  
    return result.connected;
  }
}
