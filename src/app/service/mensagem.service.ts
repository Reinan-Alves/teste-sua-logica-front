import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Mensagem } from '../model/mensagem.model';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class MensagemService {


  public emitEvent = new EventEmitter();
  //Ambiente procução produção
  //private url = 'https://reinan1971.c41.integrator.host/';
  //Ambiente teste
 //private url = 'http://localhost:8080/';

 constructor(private http: HttpClient, private db: AngularFireDatabase) {}

 // eslint-disable-next-line @typescript-eslint/member-ordering
 httpOptions = {
   // eslint-disable-next-line @typescript-eslint/naming-convention
   headers: new HttpHeaders({ 'Content-Type': 'application/json'})
 };

 public listaDeMensagem(): Observable<Mensagem[]>{
  return this.db.list<Mensagem>('mensagem').valueChanges();
}

public inserirMensagem( mensagem: Mensagem ){
 return this.db.list('mensagem').push(mensagem);
 }
}

