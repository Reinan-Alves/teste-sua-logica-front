import { Pontuacao } from './../model/potuacao.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RankingService {
  public emitEvent = new EventEmitter();

   //Ambiente procução produção
   private url = 'http://www.reinan1971.c41.integrator.host/';
   //Ambiente teste
   //private url = 'http://localhost:8080/';

  constructor(private http: HttpClient) {}

    // eslint-disable-next-line @typescript-eslint/member-ordering
    httpOptions = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };

  public listaDeRanking(): Observable<Array<Pontuacao>> {
    return this.http
      .get<Array<Pontuacao>>(`${this.url}pontuacao`)
      .pipe(
        (res) => res,
        (error) => error
      );
  }
}
