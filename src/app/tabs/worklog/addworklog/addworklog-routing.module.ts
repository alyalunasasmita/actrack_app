import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddworklogPage } from './addworklog.page';

const routes: Routes = [
  {
    path: '',
    component: AddworklogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddworklogPageRoutingModule {}
