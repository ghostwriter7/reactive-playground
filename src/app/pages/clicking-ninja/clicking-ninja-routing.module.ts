import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClickingNinjaComponent } from './clicking-ninja/clicking-ninja.component';

const routes: Routes = [
  { path: '', component: ClickingNinjaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClickingNinjaRoutingModule {}
