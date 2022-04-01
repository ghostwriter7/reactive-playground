import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaceholderDirective } from './directives/placeholder.directive';
import { HeaderComponent } from './header/header.component';



@NgModule({
  declarations: [
    PlaceholderDirective,
    HeaderComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PlaceholderDirective,
    HeaderComponent
  ]
})
export class SharedModule { }
