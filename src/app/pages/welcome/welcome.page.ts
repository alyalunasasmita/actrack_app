import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertsService } from 'src/app/services/alert/alerts';
import { ApiService } from 'src/app/services/api/api.service';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: false
})
export class WelcomePage implements OnInit {
  username: string = '';

  constructor(
    private apiService: ApiService,
    private navCtrl: NavController, 
    private alert : AlertsService
  ) { }

  ngOnInit() {
    setTimeout(async () => {
      const progress = await this.apiService.getProgress();
      if (progress && progress.username) {
        this.navCtrl.navigateRoot('/tabs');
      }
    }, 300);
  }

  async saveNameAndStart() {
  if (!this.username || this.username.trim() === '') {
    this.alert.show('Silakan masukkan nama kamu terlebih dahulu ya!');
    return;
  }
  try {
    // 1. Simpan nama ke storage lewat service (ini otomatis menunggu storage ready)
    await this.apiService.saveWelcomeName(this.username.trim());
    
    // 2. Aktifkan tiket bypass instan untuk guard
    this.apiService.isJustLoggedIn = true; 
    
    // 3. Berpindah rute dengan aman
    this.navCtrl.navigateRoot('/tabs');

  } catch (err) {
    console.error('Gagal mengunci nama user baru di storage:', err);
  }
}
}