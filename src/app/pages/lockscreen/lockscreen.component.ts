import { AfterViewInit, Component, ElementRef, OnDestroy, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  BehaviorSubject, combineLatestWith,
  filter,
  fromEvent,
  Observable,
  scan,
  startWith, Subject,
  switchMap,
  take,
  takeUntil,
  tap
} from 'rxjs';

interface State {
  pin: string;
  tiles: HTMLDivElement[]
}

@Component({
  selector: 'app-lockscreen',
  templateUrl: './lockscreen.component.html',
  styleUrls: ['./lockscreen.component.scss']
})
export class LockscreenComponent implements AfterViewInit, OnDestroy {
  @ViewChild('lockscreen', {static: true}) lockscreen!: ElementRef;
  @ViewChildren('tile', {read: ElementRef}) tiles!: QueryList<any>;
  public digits = new Array(10).fill(0).map((_, idx) => idx);
  public expectedPassword = '1234';
  private currentPin$ = new BehaviorSubject<string>(this.expectedPassword);
  public control = new FormGroup({pin: new FormControl(this.expectedPassword)});
  private swipe$: any;
  private swipeEnded$ = new Subject<boolean>();
  private allTiles!: ElementRef[];
  private destroy$ = new Subject<void>();

  ngAfterViewInit() {
    this.allTiles = this.tiles.toArray();
    this.control.get('pin')!.valueChanges.subscribe((val) => this.currentPin$.next(val));

    fromEvent<MouseEvent>(window, 'pointerup').pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.swipeEnded$.next(true);
        const numbOfSelected = this.allTiles.reduce((acc, cur) => acc += cur.nativeElement.classList.contains('pulse') ? 1 : 0, 0);
        if (numbOfSelected <= 3) {
          this.resetTiles();
        }
      }
    });

    this.swipe$ = fromEvent<MouseEvent>(window, 'pointerdown').pipe(
      takeUntil(this.destroy$),
      switchMap(() => fromEvent<MouseEvent>(this.lockscreen.nativeElement, 'mouseover').pipe(
        filter((e) => (e.target as HTMLDivElement).classList.contains('tile')),
        tap((e: MouseEvent) => {
          const tile = e.target as HTMLDivElement;
          tile.style.pointerEvents = 'none';
          tile.classList.add('pulse');
        }),
        scan<MouseEvent, State>((state, event) =>
            ({
              pin: state.pin + (event.target as HTMLDivElement).innerText,
              tiles: [...state.tiles, (event.target as HTMLDivElement)]
            })
          , {pin: '', tiles: []}),
        take(4),
        takeUntil(this.swipeEnded$),
        combineLatestWith(this.currentPin$),
        tap(([state, currentPin]) => {
          if (state.pin.length === 4) {
            const classToBeAdded = state.pin === currentPin ? 'success' : 'error';
            state.tiles.forEach(tile => {
              tile.classList.add(classToBeAdded);
            });
            this.allTiles.forEach(tile => tile.nativeElement.style.pointerEvents = 'none');
            setTimeout(this.resetTiles.bind(this), 1500);
          }
        })
      ))).subscribe();
  }

  private resetTiles() {
    this.allTiles.forEach(tile => {
      tile.nativeElement.className = 'tile';
      tile.nativeElement.style.pointerEvents = 'auto';
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

}
