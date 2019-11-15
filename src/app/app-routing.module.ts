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
  { path: 'landing', loadChildren: './landing/landing.module#LandingPageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
