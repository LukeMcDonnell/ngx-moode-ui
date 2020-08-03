import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {SocketService} from '../../service/socket.service';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent {
  public pageImage = null;
  public pageTitle = 'Library';
  public browse: Observable<any>;
  public searching = false;

  private $subs: Subscription[] = [];

  constructor(private route: ActivatedRoute, public socketService: SocketService) {

  }

}
