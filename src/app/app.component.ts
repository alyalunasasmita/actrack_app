import { Component, Optional } from '@angular/core';
import { AlertsService } from './services/alert/alerts'
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {

  alert: any = null;

  constructor(
    private alertService: AlertsService,
    private platform : Platform,
    private router : Router, 
    @Optional() private routerOutlet : IonRouterOutlet
  ) {
    this.initializeApp();
    this.alertService.alert$.subscribe(data=>{
      this.alert = data;
    });
  }

  confirm(){
    if(this.alert?.onConfim){
      this.alert.onConfim(); 
    }
    this.alert = null
  }

  cancel() {
    this.alert = null;
  }

  initializeApp(){
    this.platform.ready().then(()=> {
      this.platform.backButton.subscribeWithPriority(10, ()=> {
        if (this.routerOutlet && this.routerOutlet.canGoBack()){
          this.routerOutlet.pop(); 
        } else if (this.router.url === 'tabs/worklog'){
          App.exitApp(); 
        } else {
          this.router.navigate(['/tabs/worklog']);
        }
      });
    });
  }
}
