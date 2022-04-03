import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { concat, delay, EMPTY, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-text-animation',
  templateUrl: './text-animation.component.html',
  styleUrls: ['./text-animation.component.scss'],
})
export class TextAnimationComponent implements OnInit {
  @ViewChild('text', { static: true }) textEl!: ElementRef;
  public text$!: Observable<any>;
  private texts: string[] = [
    'Welcome', 'To', 'My', 'World', '1', '2', '3', '4', '5', 'Fight!!!'
  ];
  constructor() { }

  ngOnInit(): void {
    const observables: Observable<any>[] = [];
    this.texts.forEach((text, idx) => {
      observables.push(this.displayText(text, 1000 - idx * 100));
    });
    this.text$ = concat(...observables);
  }

  private displayText(text: string, time = 1000): Observable<any> {
    return EMPTY.pipe(startWith(text), delay(time));
  }
}
