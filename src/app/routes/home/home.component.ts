import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {SocketService} from "../../service/socket.service";
import {Observable} from "rxjs";
import {Options} from "ng5-slider";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit{

  public volumeSliderOptions: Options;
  public state: Observable<any>;

  public volume:number = 0;

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

  public emit(event: string, data = null): void {
    this.socketService.emit(event, data);
  }

  public setVolumeFromState(vol: number): void {
    this.volume = vol;
  }

  public setVolumeFromSlider(): void {
    console.log(this.volume);
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
