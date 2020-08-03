import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public apiUrl: string;
  public host: string;

  constructor(private http: HttpClient) {}

}
