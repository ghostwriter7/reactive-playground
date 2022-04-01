import { Injectable } from '@angular/core';
import { faCircleDot, faHome, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faAndroid } from '@fortawesome/free-brands-svg-icons';

@Injectable({
  providedIn: 'root'
})
export class IconsService {
  private icons: { [key: string]: IconDefinition } = {
    home: faHome,
    ninja: faAndroid,
    dot: faCircleDot
  };

  public getIcon(icon: string): any {
    return this.icons[icon];
  }
}
