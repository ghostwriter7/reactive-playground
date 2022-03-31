import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CatchTheDotComponent } from './catch-the-dot/catch-the-dot.component';

const routes: Routes = [
  { path: 'game', component: CatchTheDotComponent }
]

@NgModule({
  declarations: [
    CatchTheDotComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class CatchTheDotModule { }
