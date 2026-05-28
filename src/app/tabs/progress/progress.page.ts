import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.page.html',
  styleUrls: ['./progress.page.scss'],
  standalone: false,
})
export class ProgressPage implements OnInit {
  progress: any;
  plantImage: string = ''; 
  isHelpOpen: boolean = false;

  constructor(
    private actrakService: ApiService, 
  ) { }

  ngOnInit() {
    setTimeout(async () => {
      await this.loadProgress();
    }, 300);
  }

  async loadProgress() {
    try {
      const res = await this.actrakService.getProgress(); 
      
      this.progress = res; 
      this.setPlantImage(res.status); 
    } catch (err) {
      console.error('Gagal memuat progress lokal:', err);
    }
  }

  setPlantImage(status: string) {
    if (status === 'seed') {
      this.plantImage = 'assets/plants/seed.png'; 
    } else if (status === 'growing') {
      this.plantImage = 'assets/plants/plant.png';
    } else if (status === 'tree') {
      this.plantImage = 'assets/plants/tree.png'; 
    } else if (status === 'dead') {
      this.plantImage = 'assets/plants/dead.png';
    } else {
      this.plantImage = 'assets/plants/seed.png';
    }
  }

  getPlantSizeClass(): string {
    const growth = this.progress?.growth || 0;
    if (growth < 40) return 'small';
    if (growth < 70) return 'medium';
    return 'large';
  }

  getTip(): string {
    const growth = this.progress?.growth || 0;
    const streak = this.progress?.streak || 0;
    
    if (streak === 0) {
      return '💡 Tip: Selesaikan worklog hari ini untuk memulai streak!';
    }
    if (growth < 30) {
      return '💡 Tip: Semakin sering kamu merawat, semakin cepat tanaman tumbuh!';
    }
    if (growth < 70) {
      return '💡 Tip: Jaga konsistensi dengan menyelesaikan worklog setiap hari!';
    }
    return '💡 Tip: Hebat! Pertahankan semangatmu untuk mencapai level maksimal!';
  }

  showHelp() {
    this.isHelpOpen = true;
  }

  closeHelp() {
    this.isHelpOpen = false;
  }

  getPlantMessage(): string {
    const growth = this.progress?.growth || 0;
    const streak = this.progress?.streak || 0;
    
    if (streak === 0) {
      return 'Mulai rawat tanamanmu hari ini!';
    }
    if (growth < 30) {
      return 'Terus rawat agar tanamanmu tumbuh subur!';
    }
    if (growth < 70) {
      return 'Tanamanmu tumbuh dengan baik! Pertahankan!';
    }
    return 'Wow! Tanamanmu hampir mekar sempurna!';
  }


  getStatusIcon(): string {
    if (this.progress?.status === 'tree' || this.progress?.status === 'growing') return 'checkmark-circle-outline';
    return 'alert-circle-outline';
  }

  getStatusClass(): string {
    if (this.progress?.status === 'tree' || this.progress?.status === 'growing') return 'healthy';
    return 'warning';
  }

  getPlantGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi! 🌅';
    if (hour < 18) return 'Selamat Siang! ☀️';
    return 'Selamat Malam! 🌙';
  }

  getPlantAnimationClass(): string {
    if (this.progress?.status === 'tree' || this.progress?.status === 'growing') {
      return 'healthy-plant';
    }
    return 'warning-plant';
  }
}