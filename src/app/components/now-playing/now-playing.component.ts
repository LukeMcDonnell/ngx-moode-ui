import {ChangeDetectionStrategy, Component, OnInit, Renderer2} from '@angular/core';
import {Options} from "ng5-slider";
import {Observable} from "rxjs";
import {SocketService} from "../../service/socket.service";

@Component({
  selector: 'app-now-playing',
  templateUrl: './now-playing.component.html',
  styleUrls: ['./now-playing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NowPlayingComponent implements OnInit {

  public volumeSliderOptions: Options;
  public state: Observable<any>;
  public volume:number = 0;
  public show:boolean = false;

  constructor(public socketService: SocketService, private _renderer: Renderer2,) {
    this.state = this.socketService.getMessages('pushState');

    this.volumeSliderOptions = {
      floor: 0,
      ceil: 100,
      step: 1,
      showTicks: false,
      animate: false
    };
  }

  ngOnInit(): void {
    this.socketService.getMessages('pushState').subscribe((res: any) => {
      this.setVolumeFromState(res.volume);
    });

    if (this.show){
      this._renderer.addClass(document.body, 'show-now-playing');
    }
  }

  public hideNowPlaying (): void{
    this.show = false;
    this._renderer.removeClass(document.body, 'show-now-playing');
  }

  public showNowPlaying (): void{
    this.show = true;
    this._renderer.addClass(document.body, 'show-now-playing');
  }

  public emit(event: string, data = null): void {
    this.socketService.emit(event, data);
  }

  public setVolumeFromState(vol: number): void {
    this.volume = vol;
  }

  public setVolumeFromSlider(): void {
    this.emit('volume', this.volume)
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
