import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertsService } from 'src/app/services/alert/alerts';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-edit-worklog',
  templateUrl: './edit-worklog.page.html',
  styleUrls: ['./edit-worklog.page.scss'],
  standalone: false
})
export class EditWorklogPage implements OnInit {
  id: any; 
  form: any = {};
  errorMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private api: ApiService, 
    private router: Router, 
    private alert: AlertsService,
    private route: ActivatedRoute, 
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id'); 
    this.loadData();
  }

  loadData() {
    this.api.getWorklogs().subscribe({
      next: (res: any) => {
        const data = res.data || res; 
        this.form = data.find((item: any) => item.id == this.id);
        
        if (!this.form) {
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

  validateForm(): boolean {
    this.errorMessage = '';
    
    if (!this.form.date) {
      this.errorMessage = 'Tanggal harus diisi';
      return false;
    }
    
    if (!this.form.start) {
      this.errorMessage = 'Waktu mulai harus diisi';
      return false;
    }
    
    if (!this.form.end) {
      this.errorMessage = 'Waktu selesai harus diisi';
      return false;
    }
    
    if (!this.form.activity || this.form.activity.trim() === '') {
      this.errorMessage = 'Aktivitas harus diisi';
      return false;
    }
    
    if (!this.form.task_count || this.form.task_count <= 0) {
      this.errorMessage = 'Jumlah tugas harus diisi dan lebih dari 0';
      return false;
    }
    
    // Konversi ke format HH:mm untuk perbandingan string yang akurat
    const startTime = this.formatTime(this.form.start);
    const endTime = this.formatTime(this.form.end);

    if (startTime >= endTime) {
      this.errorMessage = 'Waktu selesai harus lebih besar dari waktu mulai';
      return false;
    }
    
    return true;
  }

  formatDate(date: string): string {
    if (!date) return '';
    // Menangani format ISO dari ion-datetime atau string date biasa
    return date.split('T')[0];
  }

  formatTime(time: string): string {
    if (!time) return '';

    // 1. Jika data sudah format HH:mm (biasanya dari database), langsung ambil 5 karakter awal
    // Data DB biasanya '08:00:00', kita jadikan '08:00'
    if (typeof time === 'string' && !time.includes('T')) {
      return time.substring(0, 5);
    }

    // 2. Jika data format ISO (dari ion-datetime), konversi dulu ke Date object
    const date = new Date(time);
    
    // Cek apakah konversi berhasil
    if (isNaN(date.getTime())) {
      // Jika gagal konversi (bukan date valid), kembalikan string aslinya dengan aman
      return typeof time === 'string' ? time.substring(0, 5) : '';
    }

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  async confirmEdit() {
  if (!this.validateForm()) {
      if (this.errorMessage) {
        this.alert.show(this.errorMessage, 'error');
      }
      return;
    }
    const isConfirmed = await this.alert.confirm('Yakin untuk mengedit data worklog ini?');
    
    if (isConfirmed) {
      this.submit();
    }
  }

  submit() {
    this.isSubmitting = true;
    const payload = {
      ...this.form,
      date: this.formatDate(this.form.date),
      start: this.formatTime(this.form.start),
      end: this.formatTime(this.form.end)
    };
    
    this.api.updateWorklog(this.id, payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.alert.show('Worklog berhasil diupdate', 'message');
        this.navCtrl.navigateForward([`/tabs/detail-worklog/${this.id}`]);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Update error:', err);
        const msg = err.error?.message || 'Gagal mengupdate worklog';
        this.errorMessage = msg;
        this.alert.show(msg, 'error');
      }
    });
  }

  goBack() {
    this.navCtrl.back();
  }
}