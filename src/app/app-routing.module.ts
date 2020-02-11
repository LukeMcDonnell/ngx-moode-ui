import {Injectable, NgModule} from '@angular/core';
import {Routes, RouterModule, Resolve} from '@angular/router';
import {HomeComponent} from "./routes/home/home.component";
import {Observable, timer} from 'rxjs';

@Injectable()
export class DelayResolve implements Resolve<Observable<any>> {
  public timer: number = 0;

  public resolve(): Observable<number> {
    return timer(this.timer);
  }
}

const routes: Routes = [
  { path: '', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
