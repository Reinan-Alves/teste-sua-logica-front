import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DesafiosService } from '../service/desafios.service';
//ADMOB
import {AdmobAds, BannerPosition, BannerSize} from 'capacitor-admob-ads';
import { ToastController } from '@ionic/angular';
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

  constructor(
    private router: Router,
    private desafioService: DesafiosService,
    public toastCtrl: ToastController
    ) {
    this.init();
    }
    ionViewDidEnter(){
      if(this.desafioService.categoria === 'erro'){
        console.log(this.desafioService.categoria);
        //location.reload();
      }
    }
  async init() {
    this.showBannerAd();
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
    if (this.desafioService.categoria !== '') {
      this.desafioService.categoria = '';
      location.reload();
    }
  }

  //ADMOB
  showBannerAd() {
    AdmobAds.showBannerAd({
      adId:'ca-app-pub-3940256099942544/6300978111',
      isTesting:true,
      adSize: BannerSize.BANNER,
      adPosition: BannerPosition.TOP,
    }).then(()=>{
      this.presentToast('Banner Ad Shown');
    })
    .catch((err)=>{
      this.presentToast(err.Mensage);
    });
  }

  hideBannerAd(){
    AdmobAds.hideBannerAd().then(()=>{
      this.presentToast('Banner Ad hidden');
    })
    .catch((err)=>{
      this.presentToast(err.Mensage);
    });
  }
  resumeBannerAd(){
    AdmobAds.resumeBannerAd().then(()=>{
      this.presentToast('Banner Ad resume');
    })
    .catch((err)=>{
      this.presentToast(err.Mensage);
    });
  }

  removeBannerAd(){
    AdmobAds.removeBannerAd().then(()=>{
      this.presentToast('Banner Ad removed');
    })
    .catch((err)=>{
      this.presentToast(err.Mensage);
    });
  }

  async presentToast(mensagem: string){
    const toast = await this.toastCtrl.create({
      message: mensagem,
      duration: 2000,
      mode:'ios',
      position:'top',
      color: 'success',
    });
    toast.present();
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
