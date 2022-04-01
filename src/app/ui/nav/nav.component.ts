import { Component, OnInit } from '@angular/core';
import { IconsService } from '../../core/services/IconsService';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor(public iconsService: IconsService) { }

  ngOnInit(): void {
  }

}
