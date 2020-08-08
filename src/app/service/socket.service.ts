import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';
import {Observable, Subject} from 'rxjs';
import {map, share} from 'rxjs/operators';
import {Md5} from 'ts-md5/dist/md5';
import {SlugifyPipe} from 'ngx-pipes';

export interface State {
  album: string;
  artist: string;
  audio?: string;
  audio_channels?: string;
  audio_sample_depth?: string;
  audio_sample_rate?: string;
  bitrate?: string;
  composer?: string;
  consume: string;
  cover_art_hash: string;
  coverurl: string;
  date: string;
  disc: string;
  duration: string;
  elapsed: string;
  encoded: string;
  file: string;
  mixrampdb: string;
  nextsong: string;
  nextsongid: string;
  playlist: string;
  playlistlength: string;
  random: string;
  repeat: string;
  single: string;
  song: string;
  song_percent: number;
  songid: string;
  state: string;
  time: string;
  title: string;
  track: string;
  volume: string;
}

@Injectable({
  providedIn: 'root',
})
export class SocketService {

  public host = 'http://moode';
  private $state: Observable<State>;
  private $library: Observable<any>;
  private $librarySub: Observable<any>;
  public stateSnapshot: State;
  private md5: Md5;

  constructor(private http: HttpClient, public slugifyPipe: SlugifyPipe) {
    // this.$librarySub = this.$getCmd('/command/moode.php?cmd=loadlib').pipe(share());
    this.$librarySub = this.http.get<any>(this.host + '/command/moode.php?cmd=loadlib').pipe(share());
    this.$librarySub.subscribe(next => {
      console.log(next);
    });
  }

  public getAlbumArt(url: string): string {
    return this.host + (url[0] !== '/' ? '/' : '') + url;
  }

  public getAlbumArtFromFile(file: string): string {
    return this.host + '/coverart.php/' + file;
  }

  public getAlbumArtThumbnail(file: string): string {
    this.md5 = new Md5();
    return this.host + '/imagesw/thmcache/' + this.md5.appendStr(file.substring(0, file.lastIndexOf('/'))).end() + '.jpg';
  }

  public slugify(str: string): string {
    return this.slugifyPipe.transform(str);
  }

  public $getState(): Observable<State> {
    if (this.$state) { return this.$state; }

    return this.$state = new Observable<State>(subscriber => {
      this.getState(subscriber);
    }).pipe(share());
  }

  private getState(subscriber) {
    this.http.get<State>(this.host + '/engine-mpd.php?state=' + (this.stateSnapshot ? this.stateSnapshot.state : '') + '&_=' + Date.now())
      .subscribe(data => {
        console.log(data);
        this.stateSnapshot = data;
        subscriber.next(data);
        this.getState(subscriber);
      }, error => {
        setTimeout(() => {
          this.getState(subscriber);
        }, 500);
      });
  }

  public $getCmd(cmd: string): Observable<any> {
    return this.http.get<any>(this.host + cmd);
  }

  public $postCmd(api: string, cmd: string, params: object = {}): Observable<any> {
    const formData: FormData = new FormData();

    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] instanceof Array) {
          params[key].forEach(item => {
            formData.append(key + '[]', item);
          });
        } else {
          formData.append(key, params[key]);
        }
      });
    }

    return new Observable<any>(subscriber => {
      this.http.post(this.host + '/command/' + api + '.php?cmd=' + cmd, formData).subscribe(response => {
        subscriber.next(response);
        subscriber.complete();
      }, error => {
        subscriber.error(error);
        // TODO: maybe show error toast.
      });
    });
  }

  public $getLibrary(): Observable<any> {
    if (this.$library) { return this.$library; }

    return this.$library = new Observable<any>(subscriber => {

      this.$librarySub.subscribe(response => {
        const artistLookup = [];
        const albumLookup = [];
        const artists = {};

        response.forEach(track => {
          const a = this.slugify(track.album_artist ? track.album_artist.replace(/^The /, '') : track.artist.replace(/^The / , ''));
          const al = this.slugify(track.year + ' ' + track.album);

          if (!artistLookup.includes(a)) {
            artistLookup.push(a);
            artists[a] = {
              name: track.album_artist ? track.album_artist : track.artist,
              slug: a,
              numberOfAlbums: 0,
              startYear: null,
              endYear: null,
              albums: {}
            };
          }

          if (!albumLookup.includes(a + '_' + al)) {
            albumLookup.push(a + '_' + al);
            artists[a].numberOfAlbums ++;
            artists[a].startYear = (!artists[a].startYear || track.year < artists[a].startYear) ? track.year : artists[a].startYear;
            artists[a].endYear = (!artists[a].endYear || track.year > artists[a].endYear) ? track.year : artists[a].endYear;
            artists[a].albums[al] = {
              name: track.album,
              slug: al,
              coverart: this.getAlbumArtFromFile(track.file),
              thumbnail: this.getAlbumArtThumbnail(track.file),
              genre: track.genre.replace(/;/g, ', '),
              year: track.year,
              tracks: []
            };
          }

          artists[a].albums[al].tracks.push(track);

        });
        // return artists;
        subscriber.next(artists);
      });
    }).pipe(share());
  }

}
