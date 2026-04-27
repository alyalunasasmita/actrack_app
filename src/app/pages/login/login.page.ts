import { Component } from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { NavController } from '@ionic/angular';
import { AlertsService } from 'src/app/services/alert/alerts';
import { Authservices } from 'src/app/services/auth';
import { NetworkServices } from 'src/app/services/network.services';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {

  username: string = '';
  password: string = '';
  showPassword: boolean = false;
  loading: boolean = false;
  isOnline = true;
  isLoading : boolean = false;

  constructor(
    private api: ApiService,
    private alert: AlertsService,
    private navCtrl: NavController,
    private auth : Authservices, 
    private network : NetworkServices
  ) {}

  ngOnInit() {
    this.network.isOnline$.subscribe(status => {
      this.isOnline = status;
    })
  }

  async login() {
    const isOnline = await this.network.isOnline();
    if(!isOnline) {
      this.alert.show('Tidak Ada Koneksi Internet', 'error')
    }
  if (!this.username || !this.password) {
    this.alert.show('Username & Password wajib diisi', 'error');
    return;
  }

  this.loading = true;

  const data = {
    username: this.username,
    password: this.password
  };
  this.isLoading = true;

  this.api.login(data).subscribe({
    next: async (res: any) => {
      this.loading = false;

      if (res?.token) {
        await this.auth.saveToken(res.token); 
        this.isLoading = false
        this.alert.show('Login berhasil', 'message');
        this.navCtrl.navigateRoot('/tabs');
      } else {
        this.alert.show('Token tidak ditemukan', 'error');
      }
    },

    error: (err) => {
      this.loading = false;
      this.isLoading = false
      console.log('LOGIN ERROR RAW:', err);

      const msg = err?.error?.message || 'Login gagal';
      this.alert.show(msg, 'error');
    }
  });
}

  registerPage() {
    this.navCtrl.navigateForward('/register');
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}