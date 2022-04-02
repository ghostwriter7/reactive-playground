import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  combineLatest, combineLatestWith,
  filter, finalize,
  fromEvent,
  merge, mergeMap,
  Observable, repeat,
  scan,
  startWith, Subject,
  switchMap,
  take,
  takeUntil, takeWhile,
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
export class LockscreenComponent implements OnInit, AfterViewInit {
  @ViewChild('lockscreen', { static: true}) lockscreen!: ElementRef;
  @ViewChildren('tile', { read: ElementRef }) tiles!: QueryList<any>;
  public digits = new Array(10).fill(0).map((_, idx) => idx);
  public expectedPassword = '1234';
  public control = new FormGroup({ pin: new FormControl(this.expectedPassword) });
  private currentPin$!: Observable<string>;
  private swipe$: any;
  private swipeEnded$ = new Subject<boolean>();
  constructor() { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.currentPin$ = this.control.get('pin')!.valueChanges.pipe(startWith(this.expectedPassword));

    fromEvent<MouseEvent>(window, 'pointerup').subscribe({
        next: () => {
          console.log("UP")
          this.swipeEnded$.next(true);
        }
    });

    this.swipe$ = fromEvent<MouseEvent>(window, 'pointerdown').pipe(
      switchMap(() => fromEvent<MouseEvent>(this.lockscreen.nativeElement, 'mouseover').pipe(
        filter((e) => (e.target as HTMLDivElement).classList.contains('tile')),
        take(4),
        tap((e: MouseEvent) => {
          const tile = e.target as HTMLDivElement;
          tile.style.pointerEvents = 'none';
          tile.classList.add('pulse');
        }),
        scan<MouseEvent, State>((state, event) =>
           ({ pin: state.pin + (event.target as HTMLDivElement).innerText,
              tiles: [...state.tiles, (event.target as HTMLDivElement)]
          })
        , { pin: '', tiles: [] }),
        takeUntil(this.swipeEnded$),
      ))).pipe(
        combineLatestWith(this.currentPin$),
        tap(([state, currentPin]) => {
          if (state.pin.length === 4) {
              const classToBeAdded = state.pin === currentPin ? 'success' : 'error';
              state.tiles.forEach(tile => {
                tile.classList.add(classToBeAdded);
              });
              setTimeout(() => {
                this.tiles.toArray().forEach(tile => {
                  tile.nativeElement.className = 'tile';
                  tile.nativeElement.style.pointerEvents = 'auto';
                });
              }, 1500);
          }
        }),
      finalize(() => {
        this.tiles.toArray().forEach(tile => {
          tile.nativeElement.className = 'tile';
          tile.nativeElement.style.pointerEvents = 'auto';
        });
      })
    ).subscribe();
  }

}
