import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickingNinjaComponent } from './clicking-ninja/clicking-ninja.component';
import { ClickingNinjaRoutingModule } from './clicking-ninja-routing.module';
import { TileComponent } from './tile/tile.component';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [
    ClickingNinjaComponent,
    TileComponent
  ],
  imports: [
    CommonModule,
    ClickingNinjaRoutingModule,
    SharedModule
  ]
})
export class ClickingNinjaModule { }
