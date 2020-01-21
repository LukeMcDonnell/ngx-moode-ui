import { Injectable } from '@angular/core';
import {Socket} from "ngx-socket-io";

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(public socket: Socket) {
    this.socket.emit('getState');
  }

  public emit(event:string, msg:any = null) {
    this.socket.emit(event, msg);
  }

  public getMessages(event:string) {
    return this.socket.fromEvent(event)
  }

}
