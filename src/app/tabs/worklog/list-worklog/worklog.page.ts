import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api/api.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-worklog',
  templateUrl: './worklog.page.html',
  styleUrls: ['./worklog.page.scss'],
  standalone: false, 
})
export class WorklogPage {

  worklogs: any[] = [];
  allWorklogs: any[] = [];
  searchKeyword: string = '';
  selectedDate: string = '';
  showDatePicker: boolean = false; 
  tempSelectedDate: string = '';
  loading = true; 
  worklog: any[] = []; 

  constructor(
    private api: ApiService, 
    private router: Router,
    private navCtrl: NavController
  ) {}

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    this.loading = true; 
    this.api.getWorklogs().subscribe({
      next: (res: any) => {
        const data = res.data || res;
        this.allWorklogs = data;
        this.worklogs = [...data];
        this.loading = false;
        console.log('DATA WORKLOG:', this.allWorklogs);
      }, 
      error: () => {
        this.loading = false;
        console.error('Error loading worklogs');
      }
    });
  }

  addWorklog() {
    this.navCtrl.navigateForward(['/tabs/addworklog']);
  }

  truncateText(text: any, length: number): any {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  }

  getTotalActivities(): number {
    return this.worklogs.reduce((total, item) => total + (item.task_count || 0), 0);
  }

  onSearch(event: any) {
    if (event && event.target) {
      this.searchKeyword = event.target.value?.toLowerCase() || '';
    }
    this.applyFilters();
  }

  clearSearch() {
    this.searchKeyword = '';
    this.applyFilters();
  }

  resetFilters() {
    this.searchKeyword = '';
    this.selectedDate = '';
    this.worklogs = [...this.allWorklogs];
  }

  applyFilters() {
    let filtered = [...this.allWorklogs];
    
    if (this.searchKeyword && this.searchKeyword.trim() !== '') {
      filtered = filtered.filter(item => {
        const activityMatch = item.activity?.toLowerCase().includes(this.searchKeyword);
        const notesMatch = item.notes?.toLowerCase().includes(this.searchKeyword);
        return activityMatch || notesMatch;
      });
    }
    
    if (this.selectedDate && this.selectedDate.trim() !== '') {
      filtered = filtered.filter(item => {
        const itemDate = item.date ? item.date.split('T')[0] : '';
        const filterDate = this.selectedDate.split('T')[0];
        return itemDate === filterDate;
      });
    }
    
    this.worklogs = filtered;
  }

  openDetail(item: any) {
    this.router.navigate(['/tabs/detail-worklog', item.id]);
  }


  toggleDatePicker() {
    this.showDatePicker = !this.showDatePicker;
    if (this.showDatePicker) {
      // Set temporary date to current selected date or today
      this.tempSelectedDate = this.selectedDate || new Date().toISOString();
    }
  }


  closeDatePicker() {
    this.showDatePicker = false;
  }


  onDateChange(event: any) {
    if (event && event.detail && event.detail.value) {
      this.tempSelectedDate = event.detail.value;
    }
  }


  applyDateFilter() {
    if (this.tempSelectedDate) {
      this.selectedDate = this.tempSelectedDate.split('T')[0];
    } else {
      this.selectedDate = '';
    }
    this.applyFilters();
    this.closeDatePicker();
  }
}