import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ProfileMenuComponent } from './profile-menu.component';



@NgModule({
  declarations: [ProfileMenuComponent],
  imports: [
    CommonModule,
    IonicModule
  ], 
  exports: [
    ProfileMenuComponent
  ]
})
export class ProfileMenuModule { }
