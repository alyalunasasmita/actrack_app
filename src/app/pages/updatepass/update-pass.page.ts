import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, IonItemGroup, NavController } from '@ionic/angular';
import { AlertsService } from 'src/app/services/alert/alerts';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-update-pass',
  templateUrl: './update-pass.page.html',
  styleUrls: ['./update-pass.page.scss'],
  standalone: false
})
export class UpdatePassPage implements OnInit {
  old_password: string = ''; 
  new_password: string = '';
  new_password_confirmation: string = ''; 
  
  // For show/hide password
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  
  // For validation messages
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting: boolean = false;
  
  // For password strength
  passwordStrength: string = '';
  strengthText: string = '';
  strengthTextClass: string = '';

  constructor(
    private api: ApiService,
    private alert: AlertsService, 
    private router: Router, 
    private route: ActivatedRoute, 
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  // Toggle password visibility
  toggleOldPassword() {
    this.showOldPassword = !this.showOldPassword;
  }

  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Validate new password strength
  validateNewPassword() {
    const password = this.new_password;
    
    if (!password || password.length === 0) {
      this.passwordStrength = '';
      this.strengthText = '';
      return;
    }
    
    // Check minimum length
    if (password.length < 6) {
      this.passwordStrength = 'weak';
      this.strengthText = 'Password minimal 6 karakter';
      this.strengthTextClass = 'weak-text';
      return;
    }
    
    // Calculate strength
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength <= 2) {
      this.passwordStrength = 'weak';
      this.strengthText = 'Password lemah';
      this.strengthTextClass = 'weak-text';
    } else if (strength <= 4) {
      this.passwordStrength = 'medium';
      this.strengthText = 'Password sedang';
      this.strengthTextClass = 'medium-text';
    } else {
      this.passwordStrength = 'strong';
      this.strengthText = 'Password kuat';
      this.strengthTextClass = 'strong-text';
    }
  }

  // Validate confirm password
  validateConfirmPassword() {
    if (this.successMessage) {
      this.successMessage = '';
    }
    
    if (this.new_password !== this.new_password_confirmation) {
      this.errorMessage = 'Konfirmasi password tidak cocok';
    } else if (this.new_password_confirmation && this.new_password_confirmation.length > 0) {
      this.errorMessage = '';
    }
  }

  // Validate all form fields
  validateForm(): boolean {
    // Reset error message
    this.errorMessage = '';
    
    // Check if all fields are filled
    if (!this.old_password || this.old_password.trim() === '') {
      this.errorMessage = 'Password lama harus diisi';
      return false;
    }
    
    if (!this.new_password || this.new_password.length === 0) {
      this.errorMessage = 'Password baru harus diisi';
      return false;
    }
    
    if (!this.new_password_confirmation || this.new_password_confirmation.length === 0) {
      this.errorMessage = 'Konfirmasi password harus diisi';
      return false;
    }
    
    // Check minimum length for new password
    if (this.new_password.length < 6) {
      this.errorMessage = 'Password baru minimal 6 karakter';
      return false;
    }
    
    // Check if password confirmation matches
    if (this.new_password !== this.new_password_confirmation) {
      this.errorMessage = 'Konfirmasi password tidak cocok';
      return false;
    }
    
    // Check if old password equals new password
    if (this.old_password === this.new_password) {
      this.errorMessage = 'Password baru harus berbeda dengan password lama';
      return false;
    }
    
    return true;
  }

  // Reset form
  resetForm() {
    this.old_password = '';
    this.new_password = '';
    this.new_password_confirmation = '';
    this.errorMessage = '';
    this.successMessage = '';
    this.passwordStrength = '';
    this.strengthText = '';
  }

  updatePassword() {
    // Validate form first
    if (!this.validateForm()) {
      return;
    }
    
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.api.updatePassword({
      old_password: this.old_password, 
      new_password: this.new_password, 
      new_password_confirmation: this.new_password_confirmation
    }).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        this.successMessage = res.message || "Password berhasil diubah";
        
        // Show success alert
        this.alert.show(this.successMessage, 'message');
        
        // Reset form
        setTimeout(() => {
          this.resetForm();
          // Navigate back to profile
          this.navCtrl.navigateBack('/tabs/profile');
        }, 2000);
      }, 
      error: (err) => {
        this.isSubmitting = false;
        const errorMsg = err.error?.message || err.message || 'Gagal update password';
        this.errorMessage = errorMsg;
        this.alert.show(errorMsg, 'error');
      }
    });
  }

  goBack() {
    this.navCtrl.navigateBack('/tabs/profile');
  }
}