import { Pontuacao } from './../model/potuacao.model';
import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RankingService {
  public emitEvent = new EventEmitter();

  private url = 'http://localhost:8080/';

  constructor(private http: HttpClient) {}

  public listaDeRanking(): Observable<Array<Pontuacao>> {
    return this.http
      .get<Array<Pontuacao>>(`${this.url}pontuacao`)
      .pipe(
        (res) => res,
        (error) => error
      );
  }
}
