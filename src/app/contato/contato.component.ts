import { Component, ElementRef, OnInit, ViewChild  } from '@angular/core';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.scss'],
})
export class ContatoComponent implements OnInit {

  @ViewChild('chatContent', { read: ElementRef }) chatContentRef: ElementRef;

  ionViewDidEnter() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    const chatContentEl: HTMLElement = this.chatContentRef.nativeElement;
    chatContentEl.scrollTop = chatContentEl.scrollHeight - chatContentEl.clientHeight;
  }
  ngOnInit() {}


}
