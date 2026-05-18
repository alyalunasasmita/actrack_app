import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api/api.service';
import { NavController } from '@ionic/angular';
import { AlertsService } from 'src/app/services/alert/alerts';

@Component({
  selector: 'app-detail-worklog',
  templateUrl: './detail-worklog.page.html',
  styleUrls: ['./detail-worklog.page.scss'],
  standalone: false
})
export class DetailWorklogPage implements OnInit {
  id: any; 
  worklog: any;

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private api: ApiService,
    private alert: AlertsService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id'); 

  }

  ionViewWillEnter(){
    this.loadData()
  }

  loadData() {
    this.api.getWorklogs().subscribe({
      next: (res: any) => {
        const data = res.data || res; 
        this.worklog = data.find((item: any) => item.id == this.id);
        if (!this.worklog) {
          this.alert.show('Data tidak ditemukan', 'error');
          this.navCtrl.navigateBack('/tabs/worklog');
        }
      },
      error: (err) => {
        console.error('Error loading worklog:', err);
        this.alert.show('Gagal memuat data', 'error');
        this.navCtrl.navigateBack('/tabs/worklog');
      }
    });
  }

  edit() {
    this.router.navigate(['/tabs/edit-worklog', this.id]);
  }

  delete() {
    this.api.deleteWorklog(this.id).subscribe({
      next: () => {
        this.alert.show('Data berhasil dihapus', 'message');
        this.navCtrl.navigateRoot('/tabs/worklog');
      },
      error: (err) => {
        console.error('Delete error:', err);
        this.alert.show('Gagal menghapus data', 'error');
      }
    });

    console.log('ppap');
  }

 async confirmDelete() {
  const isConfirmed = await this.alert.confirm('Yakin untuk menghapus worklog?');

  if (isConfirmed) {
    this.delete(); 
  }
}


  goBack() {
    this.navCtrl.navigateForward(['/tabs/worklog'])
  }

  calculateDuration(): any {
    if (!this.worklog?.start || !this.worklog?.end) return '';

    const start = this.worklog.start; 
    const end = this.worklog.end; 
    const [startHour, startMinute] = start.split(':').map(Number); 
    const [endHour, endMinute] = end.split(':').map(Number);
    
    let durationMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute); 
    if (durationMinutes < 0) {
      durationMinutes += 24 * 60;
    }

    const hours = Math.floor(durationMinutes / 60); 
    const minutes = durationMinutes % 60;
    
    if (hours === 0) {
      return `${minutes} menit`; 
    } else if (minutes === 0) {
      return `${hours} jam`;
    } else {
      return `${hours} jam ${minutes} menit`;
    }
  }
}