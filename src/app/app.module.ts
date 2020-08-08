import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {AppRoutingModule, DelayResolve} from './app-routing.module';
import { AppComponent } from './app.component';
import {SocketService} from './service/socket.service';
import { HomeComponent } from './routes/home/home.component';
import {Ng5SliderModule} from 'ng5-slider';
import {HttpClientModule} from '@angular/common/http';
import { NowPlayingComponent } from './components/now-playing/now-playing.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import { BrowseComponent } from './routes/browse/browse.component';
import {FormsModule} from '@angular/forms';
import { LibraryComponent } from './routes/library/library.component';
import {NgPipesModule, SlugifyPipe} from 'ngx-pipes';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NowPlayingComponent,
    SidebarComponent,
    BrowseComponent,
    LibraryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    Ng5SliderModule,
    FormsModule,
    NgPipesModule
  ],
  providers: [SocketService, DelayResolve, SlugifyPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
