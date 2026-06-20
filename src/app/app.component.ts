import { Component, Optional } from '@angular/core';
import { AlertsService } from './services/alert/alerts'
import { IonRouterOutlet, NavController, Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import { Router } from '@angular/router';
import { ApiService } from './services/api/api.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  showSplash: boolean = true;
  fadeOut : boolean = false;
  alert: any = null;

  constructor(
    private alertService: AlertsService,
    private platform : Platform,
    private router : Router,
    private apiService : ApiService, 
    private navCtrl : NavController,
    @Optional() private routerOutlet : IonRouterOutlet
  ) {
    this.initializeApp();
    this.alertService.alert$.subscribe(data=>{
      this.alert = data;
    });
    this.handleSplashScreen();
  }

  
  handleSplashScreen() {
    setTimeout(async () => {
      await this.checkSession(); 
      
      setTimeout(() => {
        this.fadeOut = true;  
        
        setTimeout(() => {
          this.showSplash = false;
        }, 500);
      }, 300); 

    }, 2000);
  }

  confirm(){
   this.alertService.setConfirmResult(true);
  }

  cancel() {
    this.alertService.setConfirmResult(false);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.platform.backButton.subscribeWithPriority(10, () => {
        if (this.routerOutlet && this.routerOutlet.canGoBack()) {
          this.routerOutlet.pop(); 
        } 
        else if (this.router.url === '/welcome' || this.router.url === '/tabs/worklog') {
          App.exitApp(); 
        } 
        else {
          this.router.navigate(['/tabs/worklog'], { replaceUrl: true });
        }
      });
    });
  }


  async checkSession() {
    try {
      const progress = await this.apiService.getProgress();
      if (progress && progress.username && progress.username.toString().trim() !== '') {
        await this.navCtrl.navigateRoot('/tabs', { animated: false });
      } else {
        await this.navCtrl.navigateRoot('/welcome', { animated: false });
      }
    } catch (error) {
      console.error('Gagal memeriksa sesi progress lokal di AppComponent:', error);
      await this.navCtrl.navigateRoot('/welcome', { animated: false });
    }
  }
}