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

  isLoading = false;

  async saveNameAndStart() {
  if (!this.username || this.username.trim() === '') {
    this.alert.show('Silakan masukkan nama kamu terlebih dahulu ya!');
    return;
  }
  try {
    this.isLoading = true;
    await this.apiService.saveWelcomeName(this.username.trim());
    this.apiService.isJustLoggedIn = true; 
    this.navCtrl.navigateRoot('/tabs');
  } catch (err) {
    console.error('Gagal mengunci nama user baru di storage:', err);
  }finally{
    this.isLoading = false;
  }
}
}