import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './core/helpers/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: './auth/auth.module#AuthModule'
  },
  {
    path: 'pages',
    canActivate: [AuthGuard],
    loadChildren: './pages/pages.module#PagesModule'
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'pages/feed',
    data: { state: 'feed' }
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
