import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertsService } from 'src/app/services/alert/alerts';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';

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
    private actrakService: ApiService,
    private router: Router, 
    private alert: AlertsService,
    private route: ActivatedRoute, 
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id'); 
    setTimeout(async () => {
      await this.loadData();
    }, 300);
  }

 
  async loadData() {
    try {
      const res = await this.actrakService.getWorklogs();
      const data = res.data || res; 
      this.form = data.find((item: any) => item.id == this.id);
      
      if (!this.form) {
        this.alert.show('Data tidak ditemukan', 'error');
        this.navCtrl.navigateBack('/tabs/worklog');
      }
    } catch (err) {
      console.error('Error loading worklog from storage:', err);
      this.alert.show('Gagal memuat data lokal', 'error');
      this.navCtrl.navigateBack('/tabs/worklog');
    }
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
    return date.split('T')[0];
  }

  formatTime(time: string): string {
    if (!time) return '';

    if (typeof time === 'string' && !time.includes('T')) {
      return time.substring(0, 5);
    }

    const date = new Date(time);
    
    if (isNaN(date.getTime())) {
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

  async submit() {
  this.isSubmitting = true;
  
  const formattedDate = this.formatDate(this.form.date);
  const formattedStart = this.formatTime(this.form.start);
  const formattedEnd = this.formatTime(this.form.end);
  
  try {
    await this.actrakService.updateWorklog(
      this.id,
      this.form.activity,
      this.form.task_count,
      formattedStart,
      formattedEnd,
      this.form.notes
    );
    
    this.isSubmitting = false;
    this.alert.show('Worklog berhasil diupdate', 'message');
    this.navCtrl.navigateForward([`/tabs/detail-worklog/${this.id}`]);
  } catch (err) {
    this.isSubmitting = false;
    console.error('Update error on storage:', err);
    this.errorMessage = 'Gagal mengupdate data ke memori lokal';
    this.alert.show(this.errorMessage, 'error');
  }
}

  goBack() {
    this.navCtrl.back();
  }
}