import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.page.html',
  styleUrls: ['./editprofile.page.scss'],
  standalone: false
})
export class EditprofilePage implements OnInit {
  profile: any = {};
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private api: ApiService, 
    private router: Router, 
    private route: ActivatedRoute,
    private navCtrl: NavController, 
    private alert: AlertsService
  ) { }

  ngOnInit() {
    this.getProfile();
  }

  getProfile() {
    this.api.getProfile().subscribe({
      next: (res: any) => {
        this.profile = res.data || res;
        console.log('Profile loaded:', this.profile);
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        const msg = err.error?.message || 'Gagal memuat profil';
        this.errorMessage = msg;
        this.alert.show(msg, 'error');
      }
    });
  }

  validateForm(): boolean {
    this.errorMessage = '';
    
    if (!this.profile.name || this.profile.name.trim() === '') {
      this.errorMessage = 'Nama lengkap harus diisi';
      return false;
    }
    
    if (!this.profile.username || this.profile.username.trim() === '') {
      this.errorMessage = 'Username harus diisi';
      return false;
    }
    
    if (this.profile.username.length < 3) {
      this.errorMessage = 'Username minimal 3 karakter';
      return false;
    }
    
    return true;
  }

  goBack() {
    this.navCtrl.navigateBack('/tabs/profile');
  }

  updateProfile() {
    if (!this.validateForm()) {
      return;
    }
    
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.api.updateProfile(this.profile).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        const msg = res.message || res.data?.message || 'Profile berhasil diubah';
        this.successMessage = msg;
        
        this.alert.show(msg, 'message');
        

        setTimeout(() => {
          this.navCtrl.navigateBack('/tabs/profile');
        }, 2000);
      }, 
      error: (err) => {
        this.isSubmitting = false;
        const msg = err.error?.message || err.error?.errors?.email?.[0] || 'Gagal update profile';
        this.errorMessage = msg;
        this.alert.show(msg, 'error');
        console.error('Update error:', err);
      }
    });
  }
}