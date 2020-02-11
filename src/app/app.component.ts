import {Component, HostListener} from '@angular/core';
import {SocketService} from "./service/socket.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @HostListener('window:scroll', ['$event']) onScrollEvent($event){
    //TODO: Fix this for firefox & other browsers
    this.scrolled = $event.path[1].scrollY > 50;
  }

  public state: Observable<any>;
  public scrolled = false;

  constructor(public socketService: SocketService) {
    this.state = this.socketService.getMessages('pushState');
  }

  public getAlbumArt(albumart:string): string {
    if (!albumart) {
      // TODO: return a default image here?
      return null;
    }

    if (albumart.charAt(0) === '/') {
      //todo use socket hostname here
      return this.socketService.host + albumart
    }

    return albumart;
  }

}
