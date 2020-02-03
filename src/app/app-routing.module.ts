import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginPage } from './login/login.page';
import { RegisterPage } from './register/register.page';
import { PassResetPage } from './pass-reset/pass-reset.page'

const routes: Routes = [
  { path: '', component: LoginPage},
  { path: 'register', component: RegisterPage },
  { path: 'passReset', component: PassResetPage},
  { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule' },
  { path: 'landing', loadChildren: './landing/landing.module#LandingPageModule' },
  { path: 'history-list', loadChildren: './history-list/history-list.module#HistoryListPageModule' },
  { path: 'history-detail/:id', loadChildren: './history-list/history-detail/history-detail.module#HistoryDetailPageModule' },
  { path: 'diagnostic', loadChildren: './diagnostic/diagnostic.module#DiagnosticPageModule' },
  { path: 'directory', loadChildren: './directory/directory.module#DirectoryPageModule' },
  { path: 'directory/:type', loadChildren: './directory/directory.module#DirectoryPageModule' },
  { path: 'directory-detail/:hash', loadChildren: './directory/directory-detail/directory-detail.module#DirectoryDetailPageModule' },


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
