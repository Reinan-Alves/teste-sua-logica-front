import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Mensagem } from '../model/mensagem.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MensagemService {

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

 public listaDeMensagem(): Observable<Array<Mensagem>> {
  return this.http.get<Array<Mensagem>>(`${this.url}mensagem`).pipe(
    (res) => res,
    (error) => error
  );
}

public inserirMensagem(listaDeMensagem: Mensagem): Observable<Mensagem> {
  return this.http
    .post<Mensagem>(
      `${this.url}mensagem`,
      JSON.stringify(listaDeMensagem),
      this.httpOptions
    )
    .pipe(
      (res) => res,
      (error) => error
    );
}

}
