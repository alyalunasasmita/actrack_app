import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertsService } from 'src/app/services/alert/alerts';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-addworklog',
  templateUrl: './addworklog.page.html',
  styleUrls: ['./addworklog.page.scss'],
  standalone: false
})
export class AddworklogPage implements OnInit {
  form: any = {
    date: new Date().toISOString(),
    activity: '',
    task_count: '',
    start: new Date().toISOString(),
    end: new Date().toISOString(), 
    notes: '',
  };
  
  errorMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private actrakService: ApiService,
    private alert: AlertsService
  ) { }

  ngOnInit() {
  }

  formatTime(value: string): string {
    if (!value) return '';
    const match = value.match(/(\d{2}):(\d{2})/);
    if (!match) return '';
    return `${match[1]}:${match[2]}`;
  }

  formatDate(value: string): string {
    if (!value) return '';
    return value.substring(0, 10);
  }

  validateForm(): boolean {
    this.errorMessage = '';
    
    if (!this.form.activity || this.form.activity.trim() === '') {
      this.errorMessage = 'Aktivitas harus diisi';
      return false;
    }
    
    if (!this.form.task_count || this.form.task_count <= 0) {
      this.errorMessage = 'Jumlah tugas harus diisi dan lebih dari 0';
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

    const startTime = this.formatTime(this.form.start);
    const endTime = this.formatTime(this.form.end);
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startTotal = (startHour * 60) + startMinute;
    const endTotal = (endHour * 60) + endMinute;

    if (endTotal <= startTotal) {
      this.errorMessage = 'Waktu selesai harus lebih besar dari waktu mulai';
      return false;
    }
    
    return true;
  }


  async submit() {
  if (!this.validateForm()) {
    if (this.errorMessage) {
      this.alert.show(this.errorMessage, 'error');
    }
    return;
  }
  this.isSubmitting = true;

  const formattedDate = String(this.formatDate(this.form.date));
  const formattedStart = String(this.formatTime(this.form.start));
  const formattedEnd = String(this.formatTime(this.form.end));
  const cleanActivity = String(this.form.activity);
  const cleanTaskCount = Number(this.form.task_count);
  const cleanNotes = this.form.notes ? String(this.form.notes) : '';
  
  try {
    await this.actrakService.addWorklog(
      cleanActivity,
      cleanTaskCount,
      formattedStart,
      formattedEnd,
      cleanNotes,
      formattedDate
    );
    await this.actrakService.updateProgress();
    this.isSubmitting = false;
    this.alert.show('Worklog berhasil ditambahkan & Tanamanmu tumbuh!'); 
    this.resetForm();
    this.navCtrl.navigateBack('/tabs/worklog');
  } catch (err) {
    console.error('Error saving local worklog:', err);
    this.isSubmitting = false;
    this.alert.show('Gagal menyimpan jurnal', 'error');
  }
}

  resetForm() {
    this.form = {
      date: new Date().toISOString(),
      activity: '',
      task_count: '',
      start: new Date().toISOString(),
      end: new Date().toISOString(), 
      notes: ''
    };
    this.errorMessage = '';
    console.log('Form reset');
  }
}