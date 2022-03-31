import {
  Component, ComponentFactory,
  ComponentFactoryResolver, ComponentRef,
  ElementRef, OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  finalize,
  fromEvent,
  Observable,
  repeat,
  scan, skip, skipUntil, skipWhile, Subject,
  Subscription, switchMap,
  takeWhile,
  tap,
  TimeInterval,
  timeInterval
} from 'rxjs';
import { TileComponent } from '../tile/tile.component';
import { PlaceholderDirective } from '../../../shared/directives/placeholder.directive';

interface State {
  score: number,
  interval: number,
  threshold: number
}

@Component({
  selector: 'app-clicking-ninja',
  templateUrl: './clicking-ninja.component.html',
  styleUrls: ['./clicking-ninja.component.scss'],
})
export class ClickingNinjaComponent implements OnInit, OnDestroy {
  @ViewChild('game', { static: true }) gameEl!: ElementRef;
  @ViewChild(PlaceholderDirective, { static: true }) host!: PlaceholderDirective;
  public isActive = false;
  public isGameOver = false;

  private _game$!: Subscription;
  private _labels: string[] = [
    'click, click',
    'keep clicking',
    'wow',
    'not tired yet?!',
    'click master',
    'inhuman!',
    'super human!'
  ];
  private _domElements: ComponentRef<TileComponent>[] = [];
  private _factory!: ComponentFactory<TileComponent>;
  private _start$ = new Subject<void>();


  constructor(private _componentFactory: ComponentFactoryResolver) { }

  ngOnInit(): void {
    this._factory = this._componentFactory.resolveComponentFactory(TileComponent);

    this._game$ = this._start$.pipe(switchMap(() => fromEvent(document, 'pointerdown').pipe(
      tap(console.log),
      skipWhile(() => !this.isActive),
      timeInterval(),
      tap((int) => console.log(int.interval)),
      scan<TimeInterval<Event>, State>((state, timeInterval) => ({
        score: state.score + 1,
        interval: timeInterval.interval,
        threshold: state.threshold - 2
      }), { score: 0, interval: 0, threshold: 300}),
      takeWhile(state => state.interval < state.threshold),
      tap(this.render.bind(this)),
      finalize(this.clear.bind(this)),
    ))).subscribe();
  }

  public onStart(): void {
    this._start$.next();
    this.isActive = true;
  }

  private render(state: State): void {
    const level = Math.floor(state.score / 10);
    let box = this._domElements[level];
    if (box) {
      box.instance.score = state.score.toString();
    } else {
      box = this.host.viewContainerRef.createComponent(this._factory);
      box.instance.label = this._labels[level];
      box.instance.score = state.score.toString();
      box.instance.config = {
        left: level * 20 + 'px',
        top: level * 20 + 'px',
        zIndex: level.toString(),
        backgroundColor: `rgb(150, ${level * 30}, 70`
      };

      this._domElements.push(box);
    }
  }

  private clear(): void {
  this.isGameOver = true;
    setTimeout(() => {
      this._domElements = [];
      this.host.viewContainerRef.clear();
      this.isActive = false;
      this.isGameOver = false;
    }, 3000);
  }

  ngOnDestroy() {
    this._game$.unsubscribe();
  }
}
