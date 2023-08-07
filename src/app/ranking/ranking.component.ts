import { RankingService } from './../service/ranking.service';
import { Pontuacao } from './../model/potuacao.model';
import { Component, OnInit} from '@angular/core';
import { DesafiosService } from '../service/desafios.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss'],
})
export class RankingComponent implements OnInit {
  audio: HTMLAudioElement;
  categoriaEscolhida= this.desafioService.categoria;
  statusConexao = 'sucesso';
  public listaDeRanking: Array<Pontuacao> = [];
  public listaDeCategoria: Array<string> = [];
  public rakingDaCategoria: Array<Pontuacao> = [];

  constructor(private rankingService: RankingService, private desafioService: DesafiosService) {}
  async ngOnInit() {
    this.montaRanking();
  }
  montaRanking() {
    this.statusConexao = 'aguardando';
    setTimeout(() => {
      this.rankingService.listaDeRanking().subscribe({
        next: (res) => {
          this.listaDeRanking = res;
          if(this.categoriaEscolhida === ''){
            this.categoriaEscolhida = 'raciocinio-logico';
          }
          this.dividirCategoria();
          this.ordenarRanking();
          this.enumerarPosicoes();
          this.statusConexao = 'sucesso';
        },
        error: (err) => {
          console.log(err);
          this.statusConexao = 'falha';
        },
      });
    }, 500);
  }

  play() {
    this.audio = new Audio();
    this.audio.src = 'assets/click.mp3'; // Substitua pelo caminho do seu arquivo MP3
    this.audio.load();
    this.audio.play();
  }

  dividirCategoria() {
    // O set forma um array sem valores repetidos
    const listaDeRankingSet = new Set(this.listaDeRanking.map((e) => e.categoria));
    //motando uma lista das categorias existentes
    this.listaDeCategoria = Array.from(listaDeRankingSet);
    this.listaDeCategoria.sort();
    this.rakingDaCategoria = this.listaDeRanking.filter(
      (e) => e.categoria === this.categoriaEscolhida
    );
  }
  atualizarRankingCategoria() {
  this.montaRanking();
  }

  ordenarRanking() {
    this.rakingDaCategoria = this.rakingDaCategoria.sort((i1, i2) => {
      if (i1.pontos < i2.pontos) {
        return 1;
      } else if (i1.pontos > i2.pontos) {
        return -1;
      } else {
        return 0;
      }
    });
  }
  enumerarPosicoes() {
    this.rakingDaCategoria.forEach((e, index) => {
      e.posicao = index + 1;
    });
  }
}
