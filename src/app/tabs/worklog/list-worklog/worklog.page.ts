import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';

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
  isInitialEmpty: boolean = false; 

  constructor(
    private actrakService: ApiService,
    private router: Router,
    private navCtrl: NavController
  ) {}

  ionViewWillEnter() {
    setTimeout(async () => {
      await this.loadData();
    }, 300);
  }

  async loadData() {
    this.loading = true; 
    try {
      const data = await this.actrakService.getWorklogs(); 
      if (!data || data.length === 0){
        this.isInitialEmpty = true;
        this.worklogs = [];
        this.allWorklogs = [];
      } else {
        this.isInitialEmpty = false;

        const sortedData = [...data].sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        this.allWorklogs = sortedData; 
        this.worklogs = sortedData;
      }
    } catch (error) {
      console.error('Error loading worklogs from storage', error);
    } finally {
      this.loading = false;
    }
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
      this.searchKeyword = event.target.value || '';
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
    this.tempSelectedDate = '';
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.allWorklogs];
    
    if (this.searchKeyword && this.searchKeyword.trim() !== '') {
      const keyword = this.searchKeyword.toLowerCase().trim();
      
      filtered = filtered.filter(item => {
        const activityMatch = item.activity ? item.activity.toLowerCase().includes(keyword) : false;
        const notesMatch = item.notes ? item.notes.toLowerCase().includes(keyword) : false;
        return activityMatch || notesMatch;
      });
    }
    
    if (this.selectedDate && this.selectedDate.trim() !== '') {
      const filterDate = this.selectedDate.substring(0, 10); 
      
      filtered = filtered.filter(item => {
        const itemDate = item.date ? item.date.substring(0, 10) : '';
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
      this.selectedDate = this.tempSelectedDate;
    } else {
      this.selectedDate = '';
    }
    this.applyFilters();
    this.closeDatePicker();
  }
}