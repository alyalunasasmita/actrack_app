import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditWorklogPageRoutingModule } from './edit-worklog-routing.module';

import { EditWorklogPage } from './edit-worklog.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditWorklogPageRoutingModule
  ],
  declarations: [EditWorklogPage]
})
export class EditWorklogPageModule {}
