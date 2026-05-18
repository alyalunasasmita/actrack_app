import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController, PopoverController } from '@ionic/angular';
import { ProfileMenuComponent } from 'src/app/components/profile-menu/profile-menu.component';
import { AlertsService } from 'src/app/services/alert/alerts';
import { ApiService } from 'src/app/services/api/api.service';
import { Authservices } from 'src/app/services/auth';




@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone:false
})
export class ProfilePage implements OnInit {
  profile: any;
  isPopoverOpen = false;

  constructor(
    private api : ApiService, 
    private navCtrl : NavController,
    private popoverCtrl : PopoverController, 
    private alert : AlertsService, 
    private router : Router, 
    private auth : Authservices, 
    private alertCtrl : AlertController
  ) { 
    
  }

  ngOnInit() {
    this.getProfile();
  }

  getProfile() {
  this.api.getProfile().subscribe({
    next: (res: any) => {
      this.profile = res.data || res;
    },
    error: (err) => {
      console.error('Gagal ambil profile', err);
    }
  });
}

async openMenu (ev: any) {
  const popover = await this.popoverCtrl.create({
    component: ProfileMenuComponent, 
    event: ev, 
    translucent: true
  });

  await popover.present(); 
  const{ data } = await popover.onDidDismiss(); 
  if (data === 'edit') {
    this.navCtrl.navigateForward(['/editProfile'])
  }

  if (data === 'password') {
    this.navCtrl.navigateForward(['/updatePassword'])
  }

  if (data === 'logout') {
      const isConfirmed = await this.alert.confirm('Yakin Mau Logout?');
      if (isConfirmed) {
        this.logout();
      }
    }

  if (data === "hapusakun") {
    this.deleteAccount()
  }
}

async deleteAccount() {
  const alert = await this.alertCtrl.create({
    header: 'Hapus Akun',
    message: 'Masukkan password untuk konfirmasi',
    inputs: [
      {
        name: 'password',
        type: 'password',
        placeholder: 'Password'
      }
    ],
    buttons: [
      {
        text: 'Batal',
        role: 'cancel'
      },
      {
        text: 'Hapus',
        handler: (data) => {
          if (!data.password) {
            this.alert.show('Password wajib diisi', 'error');
            return false; // Mencegah alert tertutup karena ada error
          }

          this.confirmDelete(data.password);
          return true; // Menutup alert dan memberi kepastian return ke TypeScript
        }
      }
    ]
  });

  await alert.present();
}

confirmDelete(password: string) {
  this.api.deleteAccount(password).subscribe({
    next: async () => {
      await this.auth.removeToken();
      this.alert.show('Akun berhasil dihapus', 'message');
      this.router.navigate(['/login'], { replaceUrl: true });
    },
    error: (err) => {
      console.log('DELETE ERROR:', err);
      const msg = err?.error?.message || 'Gagal hapus akun';
      this.alert.show(msg, 'error');
    }
  });
}


logout(){
  this.api.logout().subscribe({
    next: async () => {
    await this.auth.removeToken(); 
      this.alert.show('berhasil logout', 'message'); 
      this.router.navigate(['/login'], {replaceUrl: true});
    }, 
    error: async (err) => {
      console.error('logout error:', err); 
      await this.auth.removeToken();
      this.alert.show('session habis, logout paksa', 'info'); 
      this.router.navigate(['/login'], {replaceUrl: true});
    }
  });
}

}
