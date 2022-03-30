import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent {
  @Input() label!: string;
  @Input() score!: string;
  @Input() config!: { top: string, left: string, zIndex: string, backgroundColor: string };
}
