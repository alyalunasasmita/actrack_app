import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api/api.service';
import { AlertsService } from 'src/app/services/alert/alerts';
import { NavController } from '@ionic/angular';

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
    private api: ApiService,
    private alert: AlertsService
  ) { }

  ngOnInit() {
  }

  formatTime(value: string): string {
    if (!value) return '';
    const date = new Date(value);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0'); 
    return `${hours}:${minutes}`;
  }

  formatDate(value: string): string {
    if (!value) return '';
    return value.substring(0, 10);
  }

  validateForm(): boolean {
    // Reset error message
    this.errorMessage = '';
    
    // Validate activity
    if (!this.form.activity || this.form.activity.trim() === '') {
      this.errorMessage = 'Aktivitas harus diisi';
      return false;
    }
    
    // Validate task count
    if (!this.form.task_count || this.form.task_count <= 0) {
      this.errorMessage = 'Jumlah tugas harus diisi dan lebih dari 0';
      return false;
    }
    
    // Validate start time
    if (!this.form.start) {
      this.errorMessage = 'Waktu mulai harus diisi';
      return false;
    }
    
    // Validate end time
    if (!this.form.end) {
      this.errorMessage = 'Waktu selesai harus diisi';
      return false;
    }
    
    // Validate time range (start should be less than end)
    const startTime = this.formatTime(this.form.start);
    const endTime = this.formatTime(this.form.end);
    if (endTime > startTime) {
      this.errorMessage = 'Waktu selesai harus lebih besar dari waktu mulai';
      return false;
    }
    
    return true;
  }

  submit() {
    // Validate form first
    if (!this.validateForm()) {
      return;
    }
    
    this.isSubmitting = true;
    
    const data = {
      ...this.form,
      date: this.formatDate(this.form.date), 
      start: this.formatTime(this.form.start), 
      end: this.formatTime(this.form.end),
    };

    console.log('Submitting data:', data);
    
    this.api.addWorklog(data).subscribe({
      next: (res) => {
        console.log('Success:', res); 
        this.isSubmitting = false;
        this.alert.show('Worklog berhasil ditambahkan'); 
        
        // Reset form
        this.form = {
          date: new Date().toISOString(),
          activity: '',
          task_count: '',
          start: new Date().toISOString(),
          end: new Date().toISOString(), 
          notes: '',
        };
        
        // Navigate back to worklog list
        this.navCtrl.navigateBack('/tabs/worklog');
      }, 
      error: (err) => {
        console.log('Error:', err); 
        this.isSubmitting = false;
        this.alert.show('Gagal tambah data: ' + (err.message || 'Terjadi kesalahan'));
        console.log('Error Full Detail:', err);
      }
    });
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