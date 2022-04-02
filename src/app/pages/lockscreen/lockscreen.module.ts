import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LockscreenComponent } from './lockscreen.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  { path: '', component: LockscreenComponent }
]

@NgModule({
  declarations: [
    LockscreenComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule
  ]
})
export class LockscreenModule { }
