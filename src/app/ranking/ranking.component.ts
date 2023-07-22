import { RankingService } from './../service/ranking.service';
import { Pontuacao } from './../model/potuacao.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss'],
})
export class RankingComponent implements OnInit {
  statusConexao = 'sucesso';
  public listaDeRanking: Array<Pontuacao> = [];
  public rankingRaciocinioLogico: Array<Pontuacao> = [];
  public rankingLogicaMatematica: Array<Pontuacao> = [];
  public listaDeCategoria: Array<string> = [];

  constructor(private rankingService: RankingService) {}

  async ngOnInit() {
    this.montaRanking();
  }

  montaRanking() {
    this.statusConexao = 'aguardando';
    setTimeout(() => {
      this.rankingService.listaDeRanking().subscribe({
        next: (res) => {
          this.listaDeRanking = res;
          this.ordenarRanking();
          this.dividirCategoria();
          this.enumerarPosicoes();
          this.statusConexao = 'sucesso';
        },
        error: (err) => {
          console.log(err);
          this.statusConexao = 'falha';
        },
      });
    }, 2000);
  }

  // adicionarAoRanking(pontuacaoPessoal: Pontuacao) {
  //   this.listaDeRanking.push(pontuacaoPessoal);
  //   console.log('ok');
  // }

  ordenarRanking() {
    this.listaDeRanking = this.listaDeRanking.sort((i1, i2) => {
      if (i1.pontos < i2.pontos) {
        return 1;
      } else if (i1.pontos > i2.pontos) {
        return -1;
      } else {
        return 0;
      }
    });
  }
  dividirCategoria() {
    // O set forma um array sem valores repetidos
    const listaDeRankingSet = new Set(this.listaDeRanking.map((e) => e.categoria));
    //motando uma lista das categorias existentes
    this.listaDeCategoria = Array.from(listaDeRankingSet);

    this.rankingLogicaMatematica = this.listaDeRanking.filter(
      (e) => e.categoria === 'logica-matematica'
    );
    this.rankingRaciocinioLogico = this.listaDeRanking.filter(
      (e) => e.categoria === 'raciocinio-logico'
    );
  }
  enumerarPosicoes() {
    this.rankingRaciocinioLogico.forEach((e, index) => {
      e.posicao = index + 1;
    });
    this.rankingLogicaMatematica.forEach((e, index) => {
      e.posicao = index + 1;
    });
  }
}
