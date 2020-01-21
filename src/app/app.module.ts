import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SocketService} from "./service/socket.service";
import {SocketIoConfig, SocketIoModule} from "ngx-socket-io";
import { HomeComponent } from './routes/home/home.component';
import {Ng5SliderModule} from "ng5-slider";

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    Ng5SliderModule
  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
