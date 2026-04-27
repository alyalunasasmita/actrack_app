import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditWorklogPage } from './edit-worklog.page';

const routes: Routes = [
  {
    path: '',
    component: EditWorklogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditWorklogPageRoutingModule {}
