import { Pontuacao } from './../model/potuacao.model';
import { Desafio } from '../model/desafio.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DesafiosService {
  public emitEvent = new EventEmitter();
   //Ambiente procução produção
   private url = 'https://reinan1971.c41.integrator.host/';
   //Ambiente teste
  //private url = 'http://localhost:8080/';

  constructor(private http: HttpClient) {}

  // eslint-disable-next-line @typescript-eslint/member-ordering
  httpOptions = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  };

  public listaDeDesafios(): Observable<Array<Desafio>> {
    return this.http.get<Array<Desafio>>(`${this.url}desafio`).pipe(
      (res) => res,
      (error) => error
    );
  }

  public inserirPontuacao(listaDePontuacao: Pontuacao): Observable<Pontuacao> {
    return this.http
      .post<Pontuacao>(
        `${this.url}pontuacao`,
        JSON.stringify(listaDePontuacao),
        this.httpOptions
      )
      .pipe(
        (res) => res,
        (error) => error
      );
  }
}
