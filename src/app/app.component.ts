import { Component, ViewChild, OnInit } from '@angular/core';
import { IonMenu } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('audioPlayer') audioPlayer: any;
  @ViewChild(IonMenu) menu: IonMenu;
  audio: HTMLAudioElement;
  audioPaused = true;
  constructor() {}
  ngOnInit(): void {}

  play() {
    this.audio = new Audio();
    this.audio.src = 'assets/click.mp3'; // Substitua pelo caminho do seu arquivo MP3
    this.audio.load();
    this.audio.play();
  }

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


