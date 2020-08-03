import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public scrolled = false;
  public searchTerm = '';

  constructor(private router: Router, private _location: Location) {}

  public onScroll($event): void {
    this.scrolled = $event.target.scrollTop > 50;
  }

  public getSearch(): void {
    this.router.navigate(['search', this.searchTerm]);
  }

  public back(): void {
    this._location.back();
  }

}
