import {Injectable, NgModule} from '@angular/core';
import {Routes, RouterModule, Resolve} from '@angular/router';
import {HomeComponent} from './routes/home/home.component';
import {Observable, timer} from 'rxjs';
import {BrowseComponent} from './routes/browse/browse.component';

@Injectable()
export class DelayResolve implements Resolve<Observable<any>> {
  public timer = 0;

  public resolve(): Observable<number> {
    return timer(this.timer);
  }
}

const routes: Routes = [
  { path: '', component: HomeComponent },
  // { path: 'favourites', component: BrowseComponent, data: {root: 'favourites', title: 'Favourites'} },
  // { path: 'playlists', component: BrowseComponent, data: {root: 'playlists', title: 'Playlists'} },
  { path: 'library', component: BrowseComponent, data: {root: 'artists://', title: 'Library'} },
  // { path: 'radio', component: BrowseComponent, data: {root: 'radio', title: 'Web Radio'} },
  // { path: 'spotify', component: BrowseComponent, data: {root: 'spotify', title: 'Spotify'} },
  // { path: 'search/:term', component: BrowseComponent, data: {root: 'search', title: 'Search'} },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
