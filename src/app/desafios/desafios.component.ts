import { RankingService } from './../service/ranking.service';
import { Pontuacao } from './../model/potuacao.model';
import { Desafio } from '../model/desafio.model';
import { DesafiosService } from './../service/desafios.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-desafios',
  templateUrl: './desafios.component.html',
  styleUrls: ['./desafios.component.scss'],
})
export class DesafiosComponent implements OnInit {
  listaDeDesafios: Array<Desafio> = [];
  listaDeRanking: Array<Pontuacao> = [];
  id = 0;
  categoria = '';
  finalizado = false;
  pontos = 0;
  nome = '';
  statusConexao = 'sucesso';
  titulo = '';
  desabilitar = false;
  tempo = 60;
  temporizador: any = 0;
  posicao = 0;
  acertos = 0;
  desafio: Desafio = new Desafio(
    0,
    'Cada Desafio tem 4 opções de respostas, marque a resposta correta e clique em enviar antes de esgotar o tempo.',
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
    private storage: Storage
  ) {}

  // Para utilizar o ionic storage em mais de um componente o ideal é criar um service
  // ver a documentação e implementar o service para evitar bugs

  async ngOnInit() {
    this.finalizado = false;
    this.requisicaoDesafio();
    this.requisicaoRanking();
    try {
      this.categoria = await this.storage.get('categoria');
    } catch {
      this.router.navigate(['']);
      console.log('erro para ser tratado');
    }
  }

  async requisicaoDesafio() {
    this.statusConexao = 'aguardando';
    setTimeout(() => {
      this.desafioService.listaDeDesafios().subscribe({
        next: (res) => {
          this.listaDeDesafios = res;
          this.statusConexao = 'sucesso';
        },
        error: (err) => {
          console.log(err);
          this.statusConexao = 'falha';
        },
      });
    }, 2000);
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
    if (this.categoria === 'raciocinio-logico') {
      this.titulo = 'Raciocínio Lógico';
    }
    if (this.categoria === 'logica-matematica') {
      this.titulo = 'Lógica Matemática';
    }
    if (this.categoria === '') {
      this.titulo = 'Modelo';
    }
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
    console.log(this.storage.get('categoria'));
    this.desabilitar = true;
    this.montarDesafio();
  }

  public montarDesafio() {
    this.tempo = 60;
    this.relogio();
    this.templateDesafio();
  }

  public templateDesafio(){
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
  }

  public conferirResposta(suaResposta: string) {
    if (suaResposta === this.desafio.respostaCerta) {
      this.acertos += 1;
      this.pontos = this.acertos * 10;
      this.proximoDesafio();
    } else {
      clearInterval(this.temporizador);
      this.finalizar();
    }
  }

  public proximoDesafio() {
    clearInterval(this.temporizador);
    this.posicao += 1;
    this.montarDesafio();
  }
  public finalizar() {
    this.finalizado = true;
    clearInterval(this.temporizador);
    this.desabilitar = false;
    console.log(this.finalizado);
  }

  public enviar(nome: string) {
    if (nome === '') {
      nome = 'Anônimo';
    }
    this.dadosDaPontuacao(nome);
    this.inserir(this.pontuacao);
    this.router.navigate(['ranking']);
  }
  public sair() {
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
}
