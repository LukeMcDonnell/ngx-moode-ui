import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SocketService} from "./service/socket.service";
import {SocketIoConfig, SocketIoModule} from "ngx-socket-io";
import { HomeComponent } from './routes/home/home.component';
import {Ng5SliderModule} from "ng5-slider";
import {HttpClientModule} from "@angular/common/http";

const config: SocketIoConfig = { url: 'http://volumio', options: {autoConnect : false} };

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
    Ng5SliderModule
  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
