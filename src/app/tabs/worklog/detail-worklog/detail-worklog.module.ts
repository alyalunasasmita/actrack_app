import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailWorklogPageRoutingModule } from './detail-worklog-routing.module';

import { DetailWorklogPage } from './detail-worklog.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailWorklogPageRoutingModule
  ],
  declarations: [DetailWorklogPage]
})
export class DetailWorklogPageModule {}
