import { Injectable } from '@angular/core';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';

@Injectable({
  providedIn: 'root',
})

export class Authservices {
  private TOKEN_KEY = 'token'; 

  async saveToken(token:string){
    await SecureStoragePlugin.set({
      key: this.TOKEN_KEY,
      value: token
    }); 
  }

  async getToken(): Promise<string | null> {
    try {
      const result = await SecureStoragePlugin.get({ key: this.TOKEN_KEY });
      return result.value;
    } catch (error) {
      return null; 
    }
  }

  async removeToken(){
    await SecureStoragePlugin.remove({
      key: this.TOKEN_KEY
    });
  }
}
