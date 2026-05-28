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
    private apiService : ApiService, // <--- 2. INJECT API SERVICE DI SINI
    private navCtrl : NavController,
    @Optional() private routerOutlet : IonRouterOutlet
  ) {
    this.initializeApp();
    this.alertService.alert$.subscribe(data=>{
      this.alert = data;
    });
    this.handleSplashScreen();
  }

  // 3. DI SINI KUNCI UTAMANYA: Logika Timing Transisi HP
  handleSplashScreen() {
    setTimeout(async () => {
      // Tunggu sampai pengecekan session dan pemindahan rute SELESAI total
      await this.checkSession(); 
      
      // Beri jeda 300ms setelah rute dipindah agar prosesor HP selesai menggambar halaman utama di background
      setTimeout(() => {
        this.fadeOut = true;  
        
        setTimeout(() => {
          this.showSplash = false;
        }, 500);
      }, 300); 

    }, 2000); // Durasi splash screen 2-3 detik saja sudah cukup dan aman sekarang
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

  // 4. SESUAIKAN CARA NGECEK SESSION-NYA
  async checkSession() {
    try {
      // Ambil progress dari ApiService (ini otomatis nunggu database HP ready karena sudah kita pasang await storageReady)
      const progress = await this.apiService.getProgress();

      // Cek apakah ada properti username di dalam objek progress tersebut
      if (progress && progress.username && progress.username.toString().trim() !== '') {
        // USER LAMA: Langsung banting rute ke tabs tanpa animasi biar gak kedip
        await this.navCtrl.navigateRoot('/tabs', { animated: false });
      } else {
        // USER BARU: Lempar ke welcome page
        await this.navCtrl.navigateRoot('/welcome', { animated: false });
      }
    } catch (error) {
      console.error('Gagal memeriksa sesi progress lokal di AppComponent:', error);
      await this.navCtrl.navigateRoot('/welcome', { animated: false });
    }
  }
}