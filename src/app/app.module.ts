import { RankingService } from './service/ranking.service';
import { DesafiosService } from './service/desafios.service';
import { ContatoComponent } from './contato/contato.component';
import { RankingComponent } from './ranking/ranking.component';
import { HomePage } from './home/home.page';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import{HttpClientModule} from'@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';



import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DesafiosComponent } from './desafios/desafios.component';


//importação do scroll
import { ScrollingModule } from '@angular/cdk/scrolling';


@NgModule({
  declarations: [
    AppComponent,
    HomePage,
    RankingComponent,
    DesafiosComponent,
    ContatoComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    CommonModule,
    FormsModule,
    IonicModule,
    ScrollingModule,
    IonicStorageModule.forRoot(),
    HttpClientModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy},DesafiosService, HomePage, RankingService],
  bootstrap: [AppComponent],
})
export class AppModule {}
