import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { ApiService } from '../services/api/api.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private router: Router,
    private apiService: ApiService 
  ) {}

  async canActivate(): Promise<boolean | UrlTree> {
    try {
      // 1. Cek bypass instan dari welcome page tombol masuk
      if (this.apiService.isJustLoggedIn) {
        return true; 
      }

      // 2. Jika cold start aplikasi baru dibuka, cek isi progress sewajarnya
      const progress = await this.apiService.getProgress();
      
      if (progress && progress.username && progress.username.toString().trim() !== '') {
        return true; // Lolos masuk ke /tabs
      }
      
      // Jika kosong, arahkan ke welcome
      return this.router.createUrlTree(['/welcome']);
    } catch (error) {
      return this.router.createUrlTree(['/welcome']);
    }
  }
}