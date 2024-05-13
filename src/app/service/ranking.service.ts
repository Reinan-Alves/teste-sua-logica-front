import { Pontuacao } from './../model/potuacao.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/compat/database';


@Injectable({
  providedIn: 'root',
})
export class RankingService {
  public emitEvent = new EventEmitter();

   //Ambiente procução produção
  // private url = 'https://reinan1971.c41.integrator.host/';
   //Ambiente teste
   //private url = 'http://localhost:8080/';

  constructor(private http: HttpClient, private db: AngularFireDatabase) {}

    // eslint-disable-next-line @typescript-eslint/member-ordering
    httpOptions = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };

  public listaDeRanking(): Observable<Pontuacao[]> {
    return this.db.list<Pontuacao>('pontuacao').valueChanges();
  }
}
