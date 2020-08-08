import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Renderer2} from '@angular/core';
import {Options} from 'ng5-slider';
import {Observable} from 'rxjs';
import {SocketService, State} from '../../service/socket.service';

@Component({
  selector: 'app-now-playing',
  templateUrl: './now-playing.component.html',
  styleUrls: ['./now-playing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NowPlayingComponent implements OnInit {

  public volumeSliderOptions: Options;
  public $state: Observable<State>;
  public $playlist: Observable<any>;
  public state?: State;
  public volume = 0;
  public position = '0';
  public elapsed: number;
  public show = false;
  public showPlaylist = false;

  private tick = null;

  constructor(private _renderer: Renderer2, public socket: SocketService, private cdRef: ChangeDetectorRef) {

    this.volumeSliderOptions = {
      floor: 0,
      ceil: 100,
      step: 1,
      showTicks: false,
      animate: false
    };

    this.$state = this.socket.$getState();
    this.$playlist = this.socket.$getCmd('/command/moode.php?cmd=playlist');

    this.$playlist.subscribe(playlist => {
      console.log(playlist);
    });

    this.$state.subscribe(state => {
      this.$playlist = this.socket.$getCmd('/command/moode.php?cmd=playlist');
      this.volume = Number(state.volume);
      this.state = state;
      this.elapsed = Number(state.elapsed);
      this.calcPosition();
      if (state.state === 'play') {
        this.startTick();
      } else if (this.tick) {
        this.tick.clearInterval();
        this.tick = null;
      }
      this.cdRef.detectChanges();
    });

  }

  ngOnInit(): void {
    if (this.show) {
      this._renderer.addClass(document.body, 'show-now-playing');
    }
  }

  public hideNowPlaying(): void {
    this.show = false;
    this._renderer.removeClass(document.body, 'show-now-playing');
  }

  public showNowPlaying(): void {
    this.show = true;
    this._renderer.addClass(document.body, 'show-now-playing');
  }

  public togglePlaylist(force: boolean = null): void {
    this.showPlaylist = force !== null ? force : !this.showPlaylist;
  }

  public emit(api: string, cmd: string, data = null): void {
    this.socket.$postCmd(api, cmd, data).subscribe();
  }

  public setVolumeFromSlider(): void {
    console.log(this.socket);
    this.socket.$postCmd('moode', 'updvolume', {volknob: this.volume}).subscribe();
  }

  public getAlbumArt(url: string): string {
    return this.socket.host + (url[0] !== '/' ? '/' : '') + url;
  }

  public jumpToTrack(trackId: number) {
    if (trackId.toString() === this.state.song) { return; }
    this.socket.$getCmd('/command/index.php?cmd=play ' + trackId).subscribe();
  }

  private startTick() {
    if (this.tick) { this.tick.clearInterval(); this.tick = null; }
    this.tick = setInterval(() => {
      this.elapsed += 1;
      this.calcPosition();
      this.cdRef.detectChanges();
    }, 1000);
  }

  private calcPosition() {
    this.position = ((this.elapsed / Number(this.state.duration)) * 100).toString();
  }

}
