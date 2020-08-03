import {ChangeDetectionStrategy, Component, OnInit, Renderer2} from '@angular/core';
import {Options} from 'ng5-slider';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-now-playing',
  templateUrl: './now-playing.component.html',
  styleUrls: ['./now-playing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NowPlayingComponent implements OnInit {

  public volumeSliderOptions: Options;
  public state: Observable<any>;
  public volume = 0;
  public show = false;

  constructor(private _renderer: Renderer2) {

    this.volumeSliderOptions = {
      floor: 0,
      ceil: 100,
      step: 1,
      showTicks: false,
      animate: false
    };
  }

  ngOnInit(): void {
    // this.socketService.getMessages('pushState').subscribe((res: any) => {
    //   this.setVolumeFromState(res.volume);
    // });

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

  public emit(event: string, data = null): void {
  }

  public setVolumeFromState(vol: number): void {
    this.volume = vol;
  }

  public setVolumeFromSlider(): void {
    this.emit('volume', this.volume);
  }

  public getAlbumArt(albumArt: string): string {
    return albumArt;
  }
}
