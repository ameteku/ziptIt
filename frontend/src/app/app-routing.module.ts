import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './shared/home/home.component';
import { ModalModule } from './_modal';
import { TopicPageComponent } from './topic-page/topic-page.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'topics/:id', component: TopicPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), ModalModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
