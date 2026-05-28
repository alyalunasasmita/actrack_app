import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController, PopoverController } from '@ionic/angular';
import { ProfileMenuComponent } from 'src/app/components/profile-menu/profile-menu.component';
import { AlertsService } from 'src/app/services/alert/alerts';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {
  profile: any;
  isPopoverOpen = false;

  constructor(
    private apiservice: ApiService, 
    private navCtrl: NavController,
    private popoverCtrl: PopoverController, 
    private alert: AlertsService, 
    private router: Router, 
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    
  }


  ionViewWillEnter() {
    setTimeout(async () => {
      await this.getProfile();
    }, 300);
  }

  async getProfile() {
    try {
      const res = await this.apiservice.getProgress();
      this.profile = res;
      console.log('Data profil lokal:', this.profile);
    } catch (err) {
      console.error('Gagal ambil profile lokal', err);
    }
  }

  async openMenu(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: ProfileMenuComponent, 
      event: ev, 
      translucent: true
    });
    await popover.present(); 
    const { data } = await popover.onDidDismiss(); 
    if (data === 'edit') {
      this.navCtrl.navigateForward(['/editProfile']);
    }
    if (data === 'password') {
      this.navCtrl.navigateForward(['/updatePassword']);
    }
    if (data === 'logout') {
      const isConfirmed = await this.alert.confirm('Yakin Mau Keluar Aplikasi?');
      if (isConfirmed) {
        await this.logout();
      }
    }
    if (data === "resetData") {
      this.deleteAccount();
    }
  }

  async deleteAccount() {
    const alert = await this.alertCtrl.create({
      header: 'Hapus Semua Data',
      message: 'Tindakan ini akan menghapus semua catatan jurnal dan progress tanaman kamu secara permanen dari HP ini. Ketik "HAPUS" untuk konfirmasi.',
      inputs: [
        {
          name: 'confirmation',
          type: 'text',
          placeholder: 'Ketik HAPUS di sini'
        }
      ],
      buttons: [
        {
          text: 'Batal',
          role: 'cancel'
        },
        {
          text: 'Hapus Permanen',
          handler: async (data) => {
            if (data.confirmation !== 'HAPUS') {
              setTimeout(() => {
                   this.alert.show('Konfirmasi kata tidak cocok', 'error');
              }, 100)
              return true;
            }

            await this.confirmDelete();
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  async confirmDelete() {
    try {
      await this.apiservice.clearAllData();       
      this.alert.show('Semua data berhasil dibersihkan', 'message');
      this.router.navigate(['/welcome'], { replaceUrl: true });
    } catch (err) {
      console.error('Gagal membersihkan data:', err);
      this.alert.show('Gagal mereset data aplikasi', 'error');
    }
  }

  async logout() {
    try {
      this.alert.show('Berhasil keluar dari sesi aktif', 'message');
      await this.apiservice.clearProfileData();
      this.navCtrl.navigateRoot('/welcome');
    } catch (err) {
      console.error('Logout error:', err);
    }
  }
}