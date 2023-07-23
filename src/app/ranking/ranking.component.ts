import { RankingService } from './../service/ranking.service';
import { Pontuacao } from './../model/potuacao.model';
import { Component, OnInit, OnChanges } from '@angular/core';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss'],
})
export class RankingComponent implements OnInit {
  categoriaEscolhida='raciocinio-logico';
  statusConexao = 'sucesso';
  public listaDeRanking: Array<Pontuacao> = [];
  public listaDeCategoria: Array<string> = [];
  public rakingDaCategoria: Array<Pontuacao> = [];

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
          console.log(this.listaDeRanking);
          this.categoriaEscolhida = this.listaDeRanking[this.listaDeRanking.length-1].categoria;
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
    }, 2000);
  }

  dividirCategoria() {
    // O set forma um array sem valores repetidos
    const listaDeRankingSet = new Set(this.listaDeRanking.map((e) => e.categoria));
    //motando uma lista das categorias existentes
    this.listaDeCategoria = Array.from(listaDeRankingSet);
    this.rakingDaCategoria = this.listaDeRanking.filter(
      (e) => e.categoria === this.categoriaEscolhida
    );
  }

  atualizarRankingCategoria() {
    this.dividirCategoria();
    this.ordenarRanking();
    this.enumerarPosicoes();
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
