import { Component } from '@angular/core';
import {Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {SocketService} from '../../service/socket.service';
import { combineLatest } from 'rxjs';
import {map, publish, refCount, share} from 'rxjs/operators';

@Component({
  selector: 'app-artists',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
})
export class LibraryComponent {

  public $library: Observable<any>;

  constructor(public route: ActivatedRoute, public socket: SocketService) {

    this.$library = combineLatest([
      this.socket.$getLibrary(),
      this.route.params,
    ]).pipe(map(([library, params]) => {

      if (params.album) {
        return {
          pageTitle: library[params.artist].albums[params.album].name,
          pageSubTitle: 'Album by ' + library[params.artist].name,
          pageImage: library[params.artist].albums[params.album].coverart,
          view: 'album',
          list: library[params.artist].albums[params.album]
        };
      } else if (params.artist) {
        return {
          pageTitle: library[params.artist].name,
          view: 'artist',
          list: library[params.artist]
        };
      }

      return {
        pageTitle: 'Library',
        view: 'library',
        list: library
      };

    }));

    // this.socket.$getLibrary().subscribe();

    this.route.params.subscribe(data => {
      console.log(data);
    });

  }

  public playAlbum(album): void {
    const tracks = [];
    album.tracks.forEach(track => {
      tracks.push(track.file);
    });
    this.socket.$postCmd('moode', 'clrplayall', {path: tracks}).subscribe();
  }

  public queueAlbum(album): void {
    const tracks = [];
    album.tracks.forEach(track => {
      tracks.push(track.file);
    });
    this.socket.$postCmd('moode', 'addall', {path: tracks}).subscribe();
  }

}

