import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {SocketService} from '../../service/socket.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent {
  public pageImage = null;
  public pageTitle = 'Library';
  public $browse: Observable<any>;

  private $subs: Subscription[] = [];

  constructor(private route: ActivatedRoute, public socket: SocketService) {
    this.$browse = this.socket.$getCmd('/command/moode.php?cmd=loadlib').pipe(map(result => {
      const artistLookup = [];
      const albumLookup = [];
      const artists = {};

      result.forEach(track => {
        const a = track.album_artist ? track.album_artist.replace(/^The /, '') : track.artist.replace(/^The / , '');
        if (!artistLookup.includes(a)) {
          artistLookup.push(a);
          artists[a] = {
            artist: track.album_artist ? track.album_artist : track.artist,
            numberOfAlbums: 0,
            startYear: null,
            endYear: null,
            albums: {}
          };
        }

        if (!albumLookup.includes(a + '_' + track.album)) {
          albumLookup.push(a + '_' + track.album);
          artists[a].numberOfAlbums ++;
          artists[a].startYear = (!artists[a].startYear || track.year < artists[a].startYear) ? track.year : artists[a].startYear;
          artists[a].endYear = (!artists[a].endYear || track.year > artists[a].endYear) ? track.year : artists[a].endYear;
          artists[a].albums[track.album] = {
            coverart: '/coverart.php/' + track.file,
            thumbnail: socket.getAlbumArtThumbnail(track.file),
            genre: track.genre,
            year: track.year,
            tracks: []
          };
        }

        artists[a].albums[track.album].tracks.push(track);

      });
      return artists;
    }));

    this.$browse.subscribe(data => {
      console.log(data);
    });
  }

}
