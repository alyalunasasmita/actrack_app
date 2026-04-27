import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api/api.service';


@Component({
  selector: 'app-progress',
  templateUrl: './progress.page.html',
  styleUrls: ['./progress.page.scss'],
  standalone: false,
})
export class ProgressPage implements OnInit {
  progress: any;
  plantImage: string= ''; 
  isHelpOpen: boolean= false;

  constructor(
    private api: ApiService,
  ) { }

  ngOnInit() {
    this.loadProgress();
  }

  loadProgress(){
    this.api.getProgress().subscribe({
      next: (res: any) => {
        this.progress = res; 
        this.setPlantImage(res.status); 
      }, 
      error: (err) => {
        console.log(err);
      }
    })
  }

  setPlantImage(status:string){
    if (status === 'seed'){
      this.plantImage = 'assets/plants/seed.png'; 
    }else if (status === 'growing') {
      this.plantImage = 'assets/plants/plant.png';
    }else if (status === 'tree'){
      this.plantImage = 'assets/plants/tree.png'; 
    }else if (status === 'dead'){
      this.plantImage = 'assets/plants/dead.png';
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

  

  carePlant() {
    console.log('Caring for plant');
    // Increase growth and streak
    this.progress.growth = Math.min(100, (this.progress.growth || 0) + 10);
    this.progress.streak = (this.progress.streak || 0) + 1;
    this.progress.status = this.progress.growth >= 30 ? 'healthy' : 'warning';
  }

  getStatusIcon(): string {
    if (this.progress?.status === 'healthy') return 'checkmark-circle-outline';
    if (this.progress?.status === 'warning') return 'alert-circle-outline';
    return 'close-circle-outline';
  }

  getStatusClass(): string {
    if (this.progress?.status === 'healthy') return 'healthy';
    if (this.progress?.status === 'warning') return 'warning';
    return 'danger';
  }

  getPlantGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi! 🌅';
    if (hour < 18) return 'Selamat Siang! ☀️';
    return 'Selamat Malam! 🌙';
  }

   getPlantAnimationClass(): string {
    if (this.progress?.status === 'healthy') {
      return 'healthy-plant';
    }
    if (this.progress?.status === 'warning') {
      return 'warning-plant';
    }
    return '';
  }

}
