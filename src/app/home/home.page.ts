import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
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
  categoria = '';
  public modalidades: Array<string>=[];

  constructor(private router: Router, private storage: Storage, private desafioService: DesafiosService) {
    this.init();

    }

  async init() {
    this.desafioService.listaDeDesafios().subscribe({

      next: (res) => {
        const listaDedesafiosSet = new Set(res.map((item: {categoria: string}) => item.categoria));
        this.modalidades = Array.from(listaDedesafiosSet);
      },
      error: (err) => {
        console.log(err);
      },
    });



    const storage = await this.storage.create();
    this.storage = storage;
    this.categoria = await this.storage.get('categoria');
    if (this.categoria != null) {
      location.reload();
    }

    this.storage.clear();
  }
  public async carregar(modalidade: string) {
    await this.storage.set('categoria', modalidade);
    this.redirecionar();
  }

  public redirecionar() {
    this.router.navigate(['desafios']);
  }
}
