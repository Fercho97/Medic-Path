import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GuidedDiagnosticPage } from './guided-diagnostic.page';

const routes: Routes = [
  {
    path: '',
    component: GuidedDiagnosticPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GuidedDiagnosticPage]
})
export class GuidedDiagnosticPageModule {}
