import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {DelayResolve} from '../../app-routing.module';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  public objectKeys = Object.keys;

  public toggled = false;
  public toggledLarge = false;

  constructor(
      public router: Router,
      public delayResolve: DelayResolve
  ) { }

  toggleSidebar() {
    this.toggled = !this.toggled;
    this.setTimer();
  }

  toggleSidebarLarge() {
    this.toggledLarge = !this.toggledLarge;
  }

  closeSidebar() {
    this.setTimer();
    this.toggled = false;
  }

  setTimer() {
    this.delayResolve.timer = 0;

    if (this.toggled) {
      this.delayResolve.timer = 110;
    }
  }

}
