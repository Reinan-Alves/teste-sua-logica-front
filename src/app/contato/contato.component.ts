import { MensagemService } from '../service/mensagem.service';
import { Mensagem } from './../model/mensagem.model';
import { Component, ElementRef, OnInit, ViewChild  } from '@angular/core';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.scss'],
})
export class ContatoComponent implements OnInit {

  @ViewChild('chatContent', { read: ElementRef }) chatContentRef: ElementRef;

  nome = '';
  nomeValido = true;
  textoMensagem = '';
  textoValido = true;
  mensagem: Mensagem = new Mensagem(0,'','','');
  listaDeMensagens: Array<Mensagem> = [];
  statusConexao = 'sucesso';

  constructor(
    private mensagemService: MensagemService
  ){}

  ionViewDidEnter() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    const chatContentEl: HTMLElement = this.chatContentRef.nativeElement;
    chatContentEl.scrollTop = chatContentEl.scrollHeight - chatContentEl.clientHeight;
  }
  async ngOnInit() {
    this.requisicaoMensagem();
    this.ionViewDidEnter();
    this.scrollToBottom();
  }

  async requisicaoMensagem() {
    this.statusConexao = 'aguardando';
    setTimeout(() => {
      this.mensagemService.listaDeMensagem().subscribe({
        next: (res) => {
        this.listaDeMensagens = res;
        this.statusConexao = 'sucesso';
        console.log(res);
        },
        error: (err) => {
          console.log(err);
          this.statusConexao = 'falha';
        },
      });
    }, 2000);
  }

  enviar(nome: string,textoMensagem: string){
    if (this.nome.length < 3 || this.nome.length > 15) {
      this.nomeValido = false;
    } else {
      this.nomeValido = true;
    }
    if(this.textoMensagem.length < 5 || this.textoMensagem.length > 250){
      this.textoValido = false;
    }else {
      this.textoValido =true;
    }

    if(this.nomeValido && this.textoValido){
      this.mensagem.nome = this.nome;
      this.mensagem.texto = this.textoMensagem;
      this.mensagem.dataHora = this.geraDataEHora();
      this.inserir(this.mensagem);
      window.location.reload();
    }
  }

  inserir(listaDeMensagens: Mensagem) {
    return this.mensagemService.inserirMensagem(listaDeMensagens).subscribe({
      next: (res) => res,
      error: (err) => console.log(err),
    });
  }
   geraDataEHora(): string {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Os meses são indexados em zero
    const year = String(currentDate.getFullYear());
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

}
