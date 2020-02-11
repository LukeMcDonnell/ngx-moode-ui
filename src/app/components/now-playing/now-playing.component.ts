import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
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

  constructor(public socketService: SocketService) {
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
      console.log(res);
      this.setVolumeFromState(res.volume);
    });
  }

  public hideNowPlaying (): void{
    this.show = false;
  }

  public showNowPlaying (): void{
    this.show = true;
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
