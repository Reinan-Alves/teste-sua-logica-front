import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

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
  constructor(private router: Router, private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this.storage = storage;
    this.categoria = await this.storage.get('categoria');
    if (this.categoria != null) {
      location.reload();
    }

    this.storage.clear();
  }
  public async carregarLogicaMatematica() {
    await this.storage.set('categoria', 'logica-matematica');
    this.redirecionar();
  }

  public async carregarRaciocinioLogico() {
    await this.storage.set('categoria', 'raciocinio-logico');
    this.redirecionar();
  }

  public redirecionar() {
    this.router.navigate(['desafios']);
  }
}
