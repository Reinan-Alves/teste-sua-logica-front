import { MensagemService } from '../service/mensagem.service';
import { Mensagem } from './../model/mensagem.model';
import { Component, ElementRef, OnInit, ViewChild  } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';


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
  idMensagem = 0;

  constructor(
    private mensagemService: MensagemService,
    private db: AngularFireDatabase
  ){}

  async ngOnInit() {
    this.requisicaoMensagem();
  }

  async requisicaoMensagem() {
    this.statusConexao = 'aguardando';
    setTimeout(() => {
      this.mensagemService.listaDeMensagem().subscribe({
        next: (res) => {
        this.listaDeMensagens = res;
        this.idMensagem = this.listaDeMensagens[this.listaDeMensagens.length - 1].id + 1;
        this.listaDeMensagens.sort((a, b) => a.id - b.id);
        this.statusConexao = 'sucesso';
        },
        error: (err) => {
          console.log(err);
          this.statusConexao = 'falha';
        },
      });
    }, 500);
    setTimeout(() => {
      this.scrollToBottom();
      this.mensagem.nome = '';
      this.mensagem.texto = '';
    },1000);
  }

  scrollToBottom() {
    const chatContentEl: HTMLElement = this.chatContentRef.nativeElement;
    chatContentEl.scrollTop = chatContentEl.scrollHeight - chatContentEl.clientHeight;
  }

  enviar(){
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
      this.mensagem.id = this.idMensagem;
      this.mensagem.nome = this.nome;
      this.mensagem.texto = this.textoMensagem;
      this.mensagem.dataHora = this.geraDataEHora();
      this.inserir(this.mensagem);
      this.requisicaoMensagem();
      setTimeout(()=>{location.reload();},300);
    }
  }

  inserir(mensagem: Mensagem) {
    this.mensagemService.inserirMensagem(mensagem)
    .then(()=>{
      console.log('Mensagem inserida com sucesso!');
    })
    .catch(error => console.error('Erro ao inserir mensagem:', error));
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
