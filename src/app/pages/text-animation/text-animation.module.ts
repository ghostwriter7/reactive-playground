import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextAnimationComponent } from './text-animation.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: TextAnimationComponent }
];

@NgModule({
  declarations: [
    TextAnimationComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class TextAnimationModule { }
