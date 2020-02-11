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
    if ($event.path[1].scrollY > 50) {
      this.scrolled = true;
    } else {
      this.scrolled = false;
    }
    // console.log($event.path[1].scrollY);
    // console.log("scrolling");
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
