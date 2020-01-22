import { Injectable } from '@angular/core';
import {Socket} from "ngx-socket-io";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public apiUrl: string;
  public host:string;

  constructor(public socket: Socket, private http: HttpClient) {
    this.socket.emit('getState');
    this.apiUrl = `http://${window.location.hostname }/api`;
    console.log(this.apiUrl);
    this.http.get(this.apiUrl+'/host').subscribe((res:any) => {
      this.host = res.host;
      this.connect();
    }, err => {
      if (this.apiUrl == 'http://localhost:3000'){
        this.host = 'http://127.0.0.1:3000';
      } else {
        this.host = 'http://volumio';
      }
      this.connect();
    });
  }

  private connect (){
    console.log(this.host);
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
