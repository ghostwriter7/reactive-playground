import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { finalize, fromEvent, map, scan, Subscription, switchMap, takeWhile, tap, timer } from 'rxjs';

interface State {
  score: number;
  interval: number;
}

@Component({
  selector: 'app-catch-the-dot',
  templateUrl: './catch-the-dot.component.html',
  styleUrls: ['./catch-the-dot.component.scss']
})
export class CatchTheDotComponent implements OnInit {
  @ViewChild('dot', { static: true }) dot!: ElementRef;
  @ViewChild('timer', { static: true }) timer!: ElementRef;
  @ViewChild('area', { static: true }) area!: ElementRef;
  private _game$!: Subscription;
  private _horizontalRange!: [number, number];
  private _verticalRange!: [number, number];
  constructor(private _renderer: Renderer2) { }

  ngOnInit(): void {
    const { width, height } = this.area.nativeElement.getBoundingClientRect();
    this._horizontalRange = [-width / 2, width / 2];
    this._verticalRange = [-height / 2, height / 2];

    this._game$ = fromEvent(this.dot.nativeElement, 'mouseenter').pipe(
      tap(this.repositionDot.bind(this)),
      scan<any, State>((state, _) => ({
        score: state.score + 1,
        interval: state.score && state.score % 10 === 0 ? state.interval - 50 : state.interval
      }), { score: 0, interval: 500 }),
      tap(this.updateDot.bind(this)),
      switchMap((state) => timer(0, state.interval).pipe(
        map(val => 5 - val),
        tap(this.updateTimer.bind(this)))),
      takeWhile(val => !!val),
      finalize(this.updateTimer.bind(this, 'Game over!'))
      ).subscribe()
  }

  private repositionDot(): void {
    this._renderer.setStyle(this.dot.nativeElement, 'width', '5px');
    this._renderer.setStyle(this.dot.nativeElement, 'height', '5px');
    const x = Math.random() * (this._horizontalRange[1] - this._horizontalRange[0]) + this._horizontalRange[0];
    const y = Math.random() * (this._verticalRange[1] - this._verticalRange[0]) + this._verticalRange[0];
    this._renderer.setStyle(this.dot.nativeElement, 'transform', `translate(${x}px, ${y}px)`);
  }

  private updateDot(state: State): void {
    setTimeout(() => {
      this._renderer.setStyle(this.dot.nativeElement, 'width', '30px');
      this._renderer.setStyle(this.dot.nativeElement, 'height', '30px');
    }, 500);

    this._renderer.setProperty(this.dot.nativeElement, 'innerText', state.score);
    this._renderer.setStyle(this.dot.nativeElement, 'backgroundColor', '#' + Math.floor(Math.random()*16777215).toString(16));
  }

  private updateTimer(time: number | string): void {
    this._renderer.setProperty(this.timer.nativeElement, 'innerText', time);
  }
}
