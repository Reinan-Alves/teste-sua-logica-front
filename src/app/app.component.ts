import { Component, ViewChild } from '@angular/core';
import { IonMenu } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @ViewChild('audioPlayer') audioPlayer: any;
  @ViewChild(IonMenu) menu: IonMenu;
  audioPaused = true;
  constructor() {}
  fecharMenu() {
    this.menu.close();
  }
  toggleAudio() {
    if (this.audioPaused) {
      this.audioPlayer.nativeElement.play();
    } else {
      this.audioPlayer.nativeElement.pause();
    }
    this.audioPaused = !this.audioPaused;
  }
}


