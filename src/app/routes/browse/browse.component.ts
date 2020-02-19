import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {SocketService} from "../../service/socket.service";
import {Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnDestroy {
  public pageImage = null;
  public pageTitle = "Browse";
  public browse: Observable<any>;
  public searching = false;

  private $subs: Subscription[] = [];

  constructor(private route:ActivatedRoute, public socketService: SocketService) {

    this.$subs.push(
      this.route.data.subscribe(data => {
        this.pageTitle = data.title;
        if (data.root === 'search') {
          this.searching = true;
          this.$subs.push(
            this.route.paramMap.subscribe((params) => {
              this.pageTitle = data.title;
              this.pageImage = null;
              this.socketService.emit('search', {value: params.get('term')});
            })
          );
        } else {
          this.socketService.emit('browseLibrary', {uri: data.root});
        }
      })
    );

    this.browse = this.socketService.getMessages('pushBrowseLibrary');

    this.$subs.push(
      this.socketService.getMessages('pushBrowseLibrary').subscribe((data: any) => {
        console.log(data);
        if (data.navigation.info) {
          this.pageImage = this.getAlbumArt(data.navigation.info.albumart);
          if (data.navigation.info.title) {
            this.pageTitle = data.navigation.info.title;
          } else {
            this.pageTitle = data.navigation.info.artist + ' - ' + data.navigation.info.album;
          }
        }
      })
    );
  }

  public getUri(uri): void {
    this.socketService.emit('browseLibrary', {uri: uri});
  }

  public getAlbumArt(albumart:string): string {
    if (!albumart) {
      if (this.pageImage) {
        return this.pageImage;
      }
      // TODO: return a default image here?
      return null;
    }

    if (albumart.charAt(0) === '/') {
      return this.socketService.host + albumart
    }

    return albumart;
  }

  ngOnDestroy(): void {
    this.$subs.forEach((s)=>s.unsubscribe());
  }

}
