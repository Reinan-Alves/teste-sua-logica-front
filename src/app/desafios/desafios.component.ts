import { RankingService } from './../service/ranking.service';
import { Pontuacao } from './../model/potuacao.model';
import { Desafio } from '../model/desafio.model';
import { DesafiosService } from './../service/desafios.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { shuffle } from 'lodash';

@Component({
  selector: 'app-desafios',
  templateUrl: './desafios.component.html',
  styleUrls: ['./desafios.component.scss'],
})
export class DesafiosComponent implements OnInit {
  audio: HTMLAudioElement;

  listaDeDesafios: Array<Desafio> = [];
  listaDeRanking: Array<Pontuacao> = [];
  id = 0;
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
  restam =0;
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
  ) {}

  // Para utilizar o ionic storage em mais de um componente o ideal é criar um service
  // ver a documentação e implementar o service para evitar bugs

  async ngOnInit() {
    this.zerou = false;
    this.finalizado = false;
    this.categoria = this.desafioService.categoria;
    this.requisicaoDesafio();
    this.requisicaoRanking();
  }

  musicaInicio() {
    this.audio = new Audio();
    this.audio.src = 'assets/inicioTempo.mp3'; // Substitua pelo caminho do seu arquivo MP3
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
    }, 500);
    return this.tempo;
  }

  public async iniciar() {
    this.musicaInicio();
    this.listaDeDesafios =  shuffle( this.listaDeDesafios);
    this.restam = this.listaDeDesafios.length - 1;
    this.desabilitar = true;
    this.zerou = false;
    this.montarDesafio();
  }

  public montarDesafio() {
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
  }

  public conferirResposta(suaResposta: string) {
    if (suaResposta === this.desafio.respostaCerta) {
      this.acertos += 1;
      this.pontos += Number((this.tempo / 100).toFixed(4));
      this.proximoDesafio();
    } else {
      clearInterval(this.temporizador);
      this.finalizar();
    }
  }

  public proximoDesafio() {
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
    this.musicaDerrota();
    this.finalizado = true;
    clearInterval(this.temporizador);
    this.desabilitar = false;
  }

  public enviar(nome: string) {
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
    this.acertos = 0;
    this.pontos = 0.00;
    this.finalizado = false;
    this.iniciar();
  }
}
