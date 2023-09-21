import { RankingService } from './../service/ranking.service';
import { Pontuacao } from './../model/potuacao.model';
import { Desafio } from '../model/desafio.model';
import { DesafiosService } from './../service/desafios.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { shuffle } from 'lodash';
//ADMOB
import {AdmobAds} from 'capacitor-admob-ads';
import { AlertController, ToastController } from '@ionic/angular';
import { Mensagem } from '../model/mensagem.model';
import { MensagemService } from '../service/mensagem.service';

@Component({
  selector: 'app-desafios',
  templateUrl: './desafios.component.html',
  styleUrls: ['./desafios.component.scss'],
})
export class DesafiosComponent implements OnInit {
  comentario ='';
  mensagem: Mensagem = new Mensagem(0,'','','');
  audio: HTMLAudioElement;
  posicaoDica = 0;
  alternativas = ['a','b','c','d'];
  dica1 = '';
  dica2 = '';
  habilitarBotao = true;
  exibirDica ='';
  isRewarded = false;
  listaDeDesafios: Array<Desafio> = [];
  listaDeRanking: Array<Pontuacao> = [];
  id = 0;
  contador = 0;
  categoria = '';
  finalizado = false;
  zerou = false;
  pontos = 0.00;
  nome = '';
  nomeValido = true;
  statusConexao = 'sucesso';
  titulo = '';
  desabilitar = false;
  tempo = 1000;
  temporizador: any = 0.00;
  posicao = 0;
  acertos = 0;
  restam = 0;
  desafio: Desafio = new Desafio(
    0,
    'Ao marcar a resposta clique em enviar.\nCada questão tem valor máximo de 10 pontos e é decrementado ao decorrer do cronômetro',
    'Esta é a opção 1, abaixo tem outra opção',
    'Esta é a opção 2, abaixo tem outra opção',
    'Esta é a opção 3, abaixo tem outra opção',
    'Esta é a opção 4, abaixo tem o botão enviar',
    'n.d.a',
    'modelo'
  );

  pontuacao: Pontuacao = new Pontuacao(0, 0, '', 0, '');

  constructor(
    private rankingService: RankingService,
    private desafioService: DesafiosService,
    private router: Router,
    public toastCtrl: ToastController,
    public alertController: AlertController,
    private mensagemService: MensagemService
  ) {
  }

  // Para utilizar o ionic storage em mais de um componente o ideal é criar um service
  // ver a documentação e implementar o service para evitar bugs

  async ngOnInit() {
    AdmobAds.addListener('rewardedVideoAdOnRewarded', () =>{
     this.isRewarded = true;
      this.posicaoDica +=1;
    });
    this.zerou = false;
    this.finalizado = false;
    this.categoria = this.desafioService.categoria;
    this.requisicaoDesafio();
    this.requisicaoRanking();
    if(!this.categoria || this.categoria === 'erro'){
      console.log(this.desafioService.categoria);
      this.desafioService.categoria = 'erro';
      this.redirecionar();
    }
  }


  //ADMOB
  //TESTE: 'ca-app-pub-3940256099942544/1033173712'
  //PRODUÇÃO: 'ca-app-pub-1642001525444604/9927285541'
  //EM USO: teste
  loadInterstitialAd(){
    AdmobAds.loadInterstitialAd({
      adId: 'ca-app-pub-3940256099942544/1033173712',
      //ALTERAR CONFORME O USO
      isTesting: false
    }).then(()=>{
      //this.presentToast('Interstitial Ad Loaded');
    }).catch((err)=>{
      //this.presentToast(err.Mensage);
    });
  }

  showInterstitialAd(){
    AdmobAds.showInterstitialAd().then(()=>{
      //this.presentToast('Interstitial Ad showed');
    }).catch((err)=>{
     // this.presentToast(err.Mensage);
    });
  }

  loadRewardedVideoAd() {
    AdmobAds.loadRewardedVideoAd({
      //teste: 'ca-app-pub-3940256099942544/5224354917'
       //produção: 'ca-app-pub-1642001525444604/9068912717'
       //EM USO: teste
      adId: 'ca-app-pub-3940256099942544/5224354917',
      //ALTERAR CONFORME O USO
      isTesting: false,
    })
    .then(()=>{
      //this.presentToast('Rewarded video loaded');
    })
    .catch((err)=> {
      //this.presentToast(err.message);
    });
  }

  showRewardedVideoAd() {
    AdmobAds.showRewardedVideoAd().then(()=>{
      //this.presentToast('Rewarded Video Ad Showed');
    });
  }


    async presentToast(mensagem: string){
      const toast = await this.toastCtrl.create({
        message: mensagem,
        duration: 2000,
        mode:'ios',
        position:'top',
        color: 'success',
      });
      toast.present();
    }

    processaDica(resposta: string){
      this.alternativas = shuffle(this.alternativas);
      this.showRewardedVideoAd();
      this.montaDica(resposta);
      this.exibiDica();
      this.habilitarBotao = false; // Desabilita o botão
      setTimeout(() => {
        this.zeraDica();
        this.loadRewardedVideoAd();
        }, 30000);
      if(this.posicaoDica === 0){
        setTimeout(() => {
          this.habilitarBotao = true; // Reabilita o botão após 60 segundos
          }, 50000);
      }
    }

    zeraDica(){
      if(this.posicaoDica > 1 ){
        this.posicaoDica = 0;
        this.dica1='';
        this.dica2='';
      }
    }
    montaDica(resposta: string){
      if(this.posicaoDica === 0){
        this.alternativas.forEach((e)=>{
        if(e !== resposta && this.dica1 ===''){this.dica1 = e;}
        if(e !== resposta && e !== this.dica1 && this.dica2 ===''){this.dica2 = e;}
       });
      }
    }
    exibiDica(){
      if(this.posicaoDica === 0){
        this.exibirDica = this.dica1;
      }else{
        this.exibirDica = this.dica2;
      }
    }

  efeitoclick() {
    this.audio = new Audio();
    this.audio.src = 'assets/click.mp3'; // Substitua pelo caminho do seu arquivo MP3
    this.audio.load();
    this.audio.play();
  }

  musicaInicio() {
    this.audio = new Audio();
    this.audio.src = 'assets/proximodesafio.mp3'; // Substitua pelo caminho do seu arquivo MP3
    this.audio.load();
    this.audio.play();
  }
  musicaDerrota(){
    this.audio = new Audio();
    this.audio.src = 'assets/derrota.mp3'; // Substitua pelo caminho do seu arquivo MP3
    this.audio.load();
    this.audio.play();
  }

  async requisicaoDesafio() {
    this.statusConexao = 'aguardando';
    setTimeout(() => {
      this.categoria = this.desafioService.categoria;
      this.desafioService.listaDeDesafios().subscribe({
        next: (res) => {
        this.listaDeDesafios = res.filter((item: {categoria: string}) => item.categoria === this.categoria);
        this.statusConexao = 'sucesso';
        },
        error: (err) => {
          console.log(err);
          this.statusConexao = 'falha';
        },
      });
    }, 1200);
  }

  requisicaoRanking() {
    this.rankingService.listaDeRanking().subscribe({
      next: (res) => {
        this.listaDeRanking = res;
        this.id = this.listaDeRanking[this.listaDeRanking.length - 1].id + 1;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  public gerarTitulo() {
    this.titulo = this.categoria.toUpperCase().replace('-',' ');
    return this.titulo;
  }

  public relogio() {
    this.temporizador = setInterval(() => {
      this.tempo--;
      if (this.tempo < 0) {
        this.finalizar();
      }
    }, 1000);
    return this.tempo;
  }

  public async iniciar() {
    this.loadInterstitialAd();
    this.musicaInicio();
    this.contador=0;
    this.listaDeDesafios =  shuffle( this.listaDeDesafios);
    this.restam = this.listaDeDesafios.length - 1;
    this.desabilitar = true;
    this.zerou = false;
    this.montarDesafio();
  }

  public montarDesafio() {
    this.habilitarBotao = false;
    this.loadRewardedVideoAd();
    setTimeout(() => {
      this.zeraDica();
      this.habilitarBotao = true; // Reabilita o botão após 30 segundos
      }, 10000);
    this.isRewarded = false;
    this.tempo = 1000;
    this.relogio();
    this.templateDesafio();
  }

  public templateDesafio(){
    if(this.desafio){
      this.desafio.pergunta =
      this.listaDeDesafios[this.posicao].pergunta.toString();
    this.desafio.respostaA =
      this.listaDeDesafios[this.posicao].respostaA.toString();
    this.desafio.respostaB =
      this.listaDeDesafios[this.posicao].respostaB.toString();
    this.desafio.respostaC =
      this.listaDeDesafios[this.posicao].respostaC.toString();
    this.desafio.respostaD =
      this.listaDeDesafios[this.posicao].respostaD.toString();
    this.desafio.respostaCerta =
      this.listaDeDesafios[this.posicao].respostaCerta.toString();
    } else{
      alert('Não foi possivel carregar o desafio');
      this.redirecionar();
    }
  }
  public redirecionar() {
    setTimeout(()=>{this.router.navigate(['']);},300);
   // location.reload();
  }

  async presentAlert() {
      const alert = await this.alertController.create({
      header: 'Parabéns!',
      message: 'Respire e vamos para mais perguntas.',
      buttons: [{
          text: 'OK',
          handler: ()=>{
            this.proximoDesafio();
          }
      }
      ],
      cssClass: 'custom-alert'
    });
    await alert.present();
  }
  public conferirResposta(suaResposta: string) {
    this.efeitoclick();
    if (suaResposta === this.desafio.respostaCerta) {
      this.acertos += 1;
      this.contador +=1;
      this.pontos += Number((this.tempo / 100).toFixed(4));
      if(this.contador > 4){
        clearInterval(this.temporizador);
        this.showInterstitialAd();
        this.contador = 0;
        this.presentAlert();
        this.loadInterstitialAd();
      }else{
        this.proximoDesafio();
      }
    } else {
      clearInterval(this.temporizador);
      this.finalizar();
    }
  }

  public proximoDesafio() {
    this.musicaInicio();
    clearInterval(this.temporizador);
    this.posicao += 1;
    this.restam -=1;
    if(this.listaDeDesafios.indexOf(this.listaDeDesafios[this.posicao]) === -1){
      alert('PARABENS! VOCE FINALIZOU, AGUARDE NOVAS ATUALIZAÇÕES.');
      this.zerou = true;
      this.finalizar();
    }else{
      console.log(this.listaDeDesafios.indexOf(this.listaDeDesafios[this.posicao]));
      this.montarDesafio();
    }

  }
  public finalizar() {
    this.comentario = '';
    this.showInterstitialAd();
    this.musicaDerrota();
    this.finalizado = true;
    clearInterval(this.temporizador);
    this.desabilitar = false;
  }

  public enviar(nome: string) {
    this.audio.pause();
    if (this.nome.length < 3 || this.nome.length > 15) {
      this.nomeValido = false;
    } else {
      this.nomeValido = true;
      this.dadosDaPontuacao(nome);
      this.inserir(this.pontuacao);
      this.router.navigate(['ranking']);
    }
  }

  public sair() {
    this.audio.pause();
    this.router.navigate(['ranking']);
  }
  public dadosDaPontuacao(nome: string) {
    this.nome = nome;
    this.pontuacao.id = this.id;
    this.pontuacao.nome = this.nome;
    this.pontuacao.pontos = this.pontos;
    this.pontuacao.categoria = this.categoria;
  }
  inserir(listaDePontuacao: Pontuacao) {
    return this.desafioService.inserirPontuacao(listaDePontuacao).subscribe({
      next: (res) => res,
      error: (err) => console.log(err),
    });
  }
  jogarNovamente(){
    this.audio.pause();
    this.acertos = 0;
    this.pontos = 0.00;
    this.finalizado = false;
    this.iniciar();
  }
  enviarParaRevisao(comentario: string){
      this.mensagem.nome = 'REVISAR';
      this.mensagem.texto = `
      ${this.desafio.pergunta} \n
     (A) ${this.desafio.respostaA} \n
     (B) ${this.desafio.respostaB} \n
     (C) ${this.desafio.respostaC} \n
     (D) ${this.desafio.respostaD} \n
     Alterantiva (${this.desafio.respostaCerta}) está mesmo certa?`;
      this.mensagem.dataHora = this.geraDataEHora();
      this.inserirRevisao(this.mensagem);
      if(this.comentario.length >= 5){
        this.mensagem.nome = 'COMENTÁRIO';
        this.mensagem.texto = comentario;
        this.inserirRevisao(this.mensagem);
      }
    }
  inserirRevisao(listaDeMensagens: Mensagem) {
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
