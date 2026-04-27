import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class ApiService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ================= AUTH =================
  login(data: any) {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  register(data: any) {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  logout() {
    return this.http.post(`${this.baseUrl}/logout`, {});
  }

  // ================= PROFILE =================
  getProfile() {
    return this.http.get(`${this.baseUrl}/profile`);
  }

  updateProfile(data: any) {
    return this.http.put(`${this.baseUrl}/profile`, data);
  }

  updatePassword(data: any) {
    return this.http.put(`${this.baseUrl}/password`, data);
  }

  // ================= PROGRESS =================
  getProgress() {
    return this.http.get(`${this.baseUrl}/progress`);
  }

  // ================= WORKLOG =================
  getWorklogs() {
    return this.http.get(`${this.baseUrl}/worklogs`);
  }

  addWorklog(data: any) {
    return this.http.post(`${this.baseUrl}/worklog`, data);
  }

  updateWorklog(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/worklog/${id}`, data);
  }

  deleteWorklog(id: number) {
    return this.http.delete(`${this.baseUrl}/worklog/${id}`);
  }

  deleteAccount(password: string) {
  return this.http.delete(`${this.baseUrl}/profile`, {
    body: { password }
  });
}
}