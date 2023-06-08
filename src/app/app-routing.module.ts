import { HomePage } from './home/home.page';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RankingComponent } from './ranking/ranking.component';
import { ContatoComponent } from './contato/contato.component';
import { DesafiosComponent } from './desafios/desafios.component';


const routes: Routes = [
  {
    path: '',
    component: HomePage,
    pathMatch: 'full',
  },
  {path:'ranking', component:RankingComponent},
  {path:'contato', component:ContatoComponent},
  {path:'desafios', component:DesafiosComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
