import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as localForage from 'localforage';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private _storage : Storage | null = null; 
  private _storageReady: Promise<void> | null = null; // <--- 1. Tambahkan penampung status siap
  public isJustLoggedIn: boolean = false;            // <--- 2. Tambahkan flag bypass login instan

  constructor(private storage: Storage) {
    this.init(); 
  }

  async init() {
    // 3. Simpan proses pembuatan ke dalam promise agar bisa di-await oleh fungsi lain
    this._storageReady = this.storage.create().then(createdStorage => {
      this._storage = createdStorage;
    });
  }

  // ================= PROGRESS =================
  async getProgress() {
    // 4. Pastikan storage siap sebelum mencoba mengambil data (PENTING UNTUK HP!)
    if (this._storageReady) {
      await this._storageReady;
    }

    const defaultProgress = {
      username: '',
      growth: 0,
      streak: 0, 
      lastActivityDate: '', 
      status: 'seed'
    }; 
    return (await this._storage?.get('user_progress')) || defaultProgress;
  }

  async updateProgress() {
    if (this._storageReady) { await this._storageReady; }
    
    const progress = await this.getProgress(); 
    const todayStr = new Date().toISOString().split('T')[0]; 

    if (progress.lastActivityDate === '') {
      progress.streak = 1; 
    } else {
      const lastDate = new Date(progress.lastActivityDate); 
      const todayDate = new Date(todayStr);
      const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime()); 
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

      if (diffDays === 1) {
        progress.streak += 1; 
      } else if (diffDays > 1) {
        progress.streak = 1;
      }
    }
    progress.lastActivityDate = todayStr;
    progress.growth = Math.min(100, (progress.growth || 0) + 1);
    if (progress.growth <= 30) {
      progress.status = 'seed';       
    } else if (progress.growth <= 70) { 
      progress.status = 'growing';      
    } else {
      progress.status = 'tree';   
    }
    return await this._storage?.set('user_progress', progress);
  }

  async saveWelcomeName(namaBaru: string) {
    if (this._storageReady) { await this._storageReady; } // 5. Tunggu storage siap sebelum menulis

    const progress = await this.getProgress();
    progress.username = namaBaru;
    return await this._storage?.set('user_progress', progress);
  }

  async clearProfileData(): Promise<void> {
    try {
      await localForage.removeItem('username');
    } catch (error) {
      console.error('Gagal menghapus data profil lokal:', error);
      throw error; 
    }
  }

  // ================= CLEAR DATA =================
  async clearAllData() {
    if (this._storageReady) { await this._storageReady; }
    await this._storage?.clear();
    const defaultProgress = {
      username: '',
      growth: 0,
      streak: 0, 
      lastActivityDate: '', 
      status: 'seed'
    };
    await this._storage?.set('user_progress', defaultProgress);
    await this._storage?.set('worklogs', []);
  }

  // ================= WORKLOG =================
  async getWorklogs() {
    if (this._storageReady) { await this._storageReady; }
    return (await this._storage?.get('worklogs')) || []; 
  }

  async addWorklog(activity : string, task_count : number , start : string , end : string, notes : string, date : string ) {
    if (this._storageReady) { await this._storageReady; }
    const currentLogs = await this.getWorklogs(); 
    const newLog = {
      id: String(Date.now()), 
      activity: String(activity), 
      task_count: Number(task_count), 
      start: String(start),
      end: String(end), 
      notes: String(notes || ''),
      date: String(date)
    }
    currentLogs.push(newLog); 
    return await this._storage?.set('worklogs', currentLogs);
  }

  async updateWorklog(id : string, activity : string, task_count : string , start : string , end : string, notes : string) {
    if (this._storageReady) { await this._storageReady; }
    const currentLogs = await this.getWorklogs(); 
    const index = currentLogs.findIndex((log: any) => log.id == id);
    if (index !== -1) {
      currentLogs[index].activity = activity;
      currentLogs[index].task_count = task_count;
      currentLogs[index].start = start; 
      currentLogs[index].end = end;
      currentLogs[index].notes = notes;
    }
    return await this._storage?.set('worklogs', currentLogs);
  }

  async deleteWorklog(id: string) {
    if (this._storageReady) { await this._storageReady; }
    const currentLogs = await this.getWorklogs(); 
    const filteredLogs = currentLogs.filter((log: any) => log.id !== id)
    return await this._storage?.set('worklogs', filteredLogs);
  }
}