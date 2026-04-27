import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddworklogPageRoutingModule } from './addworklog-routing.module';

import { AddworklogPage } from './addworklog.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddworklogPageRoutingModule
  ],
  declarations: [AddworklogPage]
})
export class AddworklogPageModule {}
