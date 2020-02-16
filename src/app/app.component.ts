import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public scrolled = false;

  constructor() {}

  public onScroll($event){
    this.scrolled = $event.target.scrollTop > 50;
  }

}
