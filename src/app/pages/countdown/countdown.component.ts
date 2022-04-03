import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import {
  empty,
  fromEvent,
  interval,
  mapTo,
  merge,
  Observable,
  repeat,
  scan,
  startWith, Subscription,
  switchMap,
  takeWhile,
  tap
} from 'rxjs';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit, OnDestroy {
  @ViewChild('pause', { static: true }) pause!: ElementRef;
  @ViewChild('resume', { static: true }) resume!: ElementRef;
  @ViewChild('restart', { static: true }) restart!: ElementRef;
  @ViewChild('countDisplay', { static: true }) countDisplay!: ElementRef;
  public initialCount = 20;
  private _pause$!: Observable<boolean>;
  private _resume$!: Observable<boolean>;
  private _restart$!: Observable<any>;
  private _subscription!: Subscription;

  constructor(private _renderer: Renderer2) {}

  ngOnInit(): void {
    this._pause$ = fromEvent(this.pause.nativeElement, 'click').pipe(mapTo(false));
    this._resume$ = fromEvent(this.resume.nativeElement, 'click').pipe(mapTo(true));
    this._restart$ = fromEvent(this.restart.nativeElement, 'click').pipe(tap(() => this.initialCount = 21))

    this._subscription = merge(this._pause$, this._resume$, this._restart$).pipe(
      startWith(true),
      switchMap(val => val ? interval(1000).pipe(mapTo(1)) : empty()),
      scan<number, number>((_, val) =>{
        this.initialCount -= val;
        return this.initialCount;
      } , this.initialCount),
      takeWhile(val => val >= 0),
      repeat()
    ).subscribe(this.updateDisplay.bind(this));
  }

  private updateDisplay(val: number): void {
    this._renderer.setProperty(this.countDisplay.nativeElement, 'innerText', val);
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}


