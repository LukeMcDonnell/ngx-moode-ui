import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public scrolled = false;
  public searchTerm = "";

  constructor(public router: Router) {}

  public onScroll($event): void{
    this.scrolled = $event.target.scrollTop > 50;
  }

  public getSearch(): void {
    console.log(this.searchTerm);
    this.router.navigate(['search', this.searchTerm]);
  }

}
