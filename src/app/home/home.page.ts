import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DesafiosService } from '../service/desafios.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
@Injectable({
  providedIn: 'root',
})
export class HomePage {
  audio: HTMLAudioElement;
  statusConexao = 'sucesso';
  public modalidades: Array<string>=[];

  constructor(private router: Router, private desafioService: DesafiosService,) {
    this.init();
    }
  async init() {
    this.statusConexao = 'aguardando';
    this.desafioService.listaDeDesafios().subscribe({
      next: (res) => {
        const listaDedesafiosSet = new Set(res.map((item: {categoria: string}) => item.categoria));
        this.modalidades = Array.from(listaDedesafiosSet);
        this.modalidades.sort();
        this.statusConexao = 'sucesso';
      },
      error: (err) => {
        console.log(err);
        this.statusConexao = 'falha';
      },
    });

    this.desafioService.categoria = '';
    if (this.desafioService.categoria !== '') {
      location.reload();
    }
  }

  pause(){
    this.audio.pause();
  }

  play() {
    this.audio = new Audio();
    this.audio.src = 'assets/click.mp3'; // Substitua pelo caminho do seu arquivo MP3
    this.audio.load();
    this.audio.play();
  }

  public async carregar(modalidade: string) {
    this.desafioService.categoria = modalidade;
    this.redirecionar();
  }

  public redirecionar() {
    setTimeout(()=>{this.router.navigate(['desafios']);},300);
  }
}
