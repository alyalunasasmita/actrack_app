import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api/api.service';
import { NavController } from '@ionic/angular';
import { AlertsService } from 'src/app/services/alert/alerts';
import { Authservices } from 'src/app/services/auth';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage implements OnInit {
  name: string=''; 
  username: string=''; 
  password: string='';
  showPassword: boolean = false;
  passwordError: boolean = false;
  passwordErrorMessage: string = '';
  passwordStrength: string = ''; 
  strengthText: string = '';
  isLoading: boolean = false;

  constructor(
    private api: ApiService,
    private router: Router,
    private alert: AlertsService, 
    private navCtrl : NavController, 
    private auth : Authservices
  ) { }

  ngOnInit() {
  }

  register() {

  if (!this.isFormValid()) {

    this.alert.show(
      'Semua field wajib diisi dengan benar',
      'error'
    );

    return;
  }

  const data = {
    name: this.name,
    username: this.username,
    password: this.password,
  };

  this.isLoading = true;

  this.api.register(data).subscribe({

    next: (res: any) => {

      this.isLoading = false;

      this.alert.show(
        'Register berhasil, silahkan login',
        'message'
      );

      this.router.navigateByUrl('/login');

    },

    error: (err) => {

      this.isLoading = false;

      console.log('REGISTER ERROR:', err);

      let message = 'Register gagal';

      // Validation Laravel
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

      // Tidak bisa konek server
      else if (err.status === 0) {

        message = 'Tidak dapat terhubung ke server';

      }

      this.alert.show(message, 'error');

    }

  });

}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  goToLogin() {
    this.navCtrl.navigateForward('/login');
  }

  validatePassword() {
    this.passwordError = false;
    this.passwordErrorMessage = '';
    
    if (!this.password || this.password.length === 0) {
      this.passwordStrength = '';
      this.strengthText = '';
      return;
    }

    if (this.password.length < 6) {
      this.passwordError = true;
      this.passwordErrorMessage = 'Password harus minimal 6 karakter';
      this.passwordStrength = '';
      this.strengthText = '';
      return;
    }

    let strengthScore = 0;
  
    if (this.password.length >= 8) strengthScore++;
    if (this.password.length >= 12) strengthScore++;
    if (/[a-z]/.test(this.password)) strengthScore++;
    if (/[A-Z]/.test(this.password)) strengthScore++;
    if (/[0-9]/.test(this.password)) strengthScore++;
    if (/[^A-Za-z0-9]/.test(this.password)) strengthScore++;

    if (strengthScore <= 2) {
      this.passwordStrength = 'weak';
      this.strengthText = 'Password lemah';
    } else if (strengthScore <= 4) {
      this.passwordStrength = 'medium';
      this.strengthText = 'Password sedang';
    } else {
      this.passwordStrength = 'strong';
      this.strengthText = 'Password kuat';
    }
  }

   isFormValid(): boolean {
    const isNameValid = this.name && this.name.trim().length > 0;
    const isUsernameValid = this.username && this.username.trim().length > 0;
    const isPasswordValid = this.password && this.password.length >= 6;
    
    return !!(isNameValid && isUsernameValid && isPasswordValid);
  }


}
