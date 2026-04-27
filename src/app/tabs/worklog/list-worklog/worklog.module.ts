import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorklogPageRoutingModule } from './worklog-routing.module';

import { WorklogPage } from './worklog.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorklogPageRoutingModule
  ],
  declarations: [WorklogPage]
})
export class WorklogPageModule {}
