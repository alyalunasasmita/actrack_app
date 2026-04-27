import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorklogPage } from './worklog.page';

const routes: Routes = [
  {
    path: '',
    component: WorklogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorklogPageRoutingModule {}
