import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

  const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'worklog',
        loadChildren: () =>
          import('./worklog/list-worklog/worklog.module').then(m => m.WorklogPageModule)
      },
      {
        path: 'addworklog',
        loadChildren: () =>
          import('./worklog/addworklog/addworklog.module').then(m => m.AddworklogPageModule)
      },
      {
        path: 'plant',
        loadChildren: () =>
          import('./progress/progress.module').then(m => m.ProgressPageModule)
      },
      {
        path: 'worklog',
        loadChildren: () =>
          import('./worklog/list-worklog/worklog.module').then(m => m.WorklogPageModule)
      },
      {
        path: 'detail-worklog/:id',
        loadChildren: () =>
          import('./worklog/detail-worklog/detail-worklog.module').then(m => m.DetailWorklogPageModule)
      },

      {
        path: 'edit-worklog/:id',
        loadChildren: () =>
          import('./worklog/edit-worklog/edit-worklog.module').then(m => m.EditWorklogPageModule)
      },

      {
        path: 'progress',
        loadChildren: () =>
          import('./progress/progress.module').then(m => m.ProgressPageModule)
      },
      {
        path: '',
        redirectTo: 'worklog',
        pathMatch: 'full'
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
      },

       {
        path: 'statistic',
        loadChildren: () => import('./statistic/statistic.module').then( m => m.StatisticPageModule)
      },


    ]
  },
 
  
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
