import { Injectable } from '@angular/core';
import {Socket} from "ngx-socket-io";
import {HttpClient} from "@angular/common/http";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public apiUrl: string;
  public host:string;

  constructor(public socket: Socket, private http: HttpClient) {
    this.socket.emit('getState');
    this.apiUrl = `http://${window.location.hostname }/api`;

    this.http.get(this.apiUrl+'/host').subscribe((res:any) => {
      this.host = res.host;
      this.connect();
    }, err => {
      if (this.apiUrl == 'http://localhost/api'){
        this.host = 'http://192.168.1.25';
        if (environment.production) {
          this.host = 'http://127.0.0.1:3000';
        }
      }
      this.connect();
    });
  }

  private connect (){
    this.socket.ioSocket.io.uri = this.host;
    this.socket.connect()
  }

  public emit(event:string, msg:any = null) {
    this.socket.emit(event, msg);
  }

  public getMessages(event:string) {
    return this.socket.fromEvent(event)
  }

}
