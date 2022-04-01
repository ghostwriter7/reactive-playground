import { Component, OnInit } from '@angular/core';
import { IconsService } from '../../core/services/IconsService';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public gameList: { path: string, icon: string, name: string }[] = [
    { path: '/catch-the-dot', icon: 'dot', name: 'Catch the dot!' },
    { path: '/clicking-ninja', icon: 'ninja', name: 'Clicking Ninja' },
  ];

  constructor(public iconsService: IconsService) { }

  ngOnInit(): void {
  }

}
