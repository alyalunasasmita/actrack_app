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
  isOnline: boolean = true;

  constructor(
    private api: ApiService,
    private alert: AlertsService,
    private navCtrl: NavController,
    private auth: Authservices,
    private network: NetworkServices
  ) {}

  ngOnInit() {

    this.network.isOnline$.subscribe(status => {
      this.isOnline = status;
    });

  }

  ionViewWillEnter() {
    this.checkNetworkStatus();
  }

  async checkNetworkStatus() {

    const isOnline = await this.network.isOnline();

    if (!isOnline) {

      this.alert.show(
        'Kamu sedang offline, cek koneksi internet',
        'error'
      );

    }
  }

  async login() {

    if (!this.username || !this.password) {

      this.alert.show(
        'Username dan password wajib diisi',
        'error'
      );

      return;
    }

    if (!this.isOnline) {

      this.alert.show(
        'Tidak ada koneksi internet',
        'error'
      );

      return;
    }

    this.loading = true;

    const data = {
      username: this.username,
      password: this.password
    };

    this.api.login(data).subscribe({

      next: async (res: any) => {

        this.loading = false;

        if (res?.token) {

          await this.auth.saveToken(res.token);

          this.alert.show(
            'Login berhasil',
            'message'
          );

          this.navCtrl.navigateRoot('/tabs');

        } else {

          this.alert.show(
            'Token tidak ditemukan',
            'error'
          );
        }
      },

      error: (err) => {

        this.loading = false;


        console.log('LOGIN ERROR:', err);

        let message = 'Terjadi kesalahan';

        // Laravel validation error
        if (err.error?.errors) {

          const errors = Object.values(err.error.errors);

          message = errors
            .map((e: any) => e[0])
            .join(', ');

        }

        // Error biasa
        else if (err.error?.message) {

          message = err.error.message;

        }

        // Server / network error
        else if (err.status === 0) {

          message = 'Tidak dapat terhubung ke server';

        }

        this.alert.show(message, 'error');

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