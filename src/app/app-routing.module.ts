import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  { path: 'clicking-ninja', loadChildren: () => import('./pages/clicking-ninja/clicking-ninja.module').then(m => m.ClickingNinjaModule )},
  { path: 'catch-the-dot', loadChildren: () => import('./pages/catch-the-dot/catch-the-dot.module').then(m => m.CatchTheDotModule)},
  { path: 'lockscreen', loadChildren: () => import('./pages/lockscreen/lockscreen.module').then(m => m.LockscreenModule)},
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
