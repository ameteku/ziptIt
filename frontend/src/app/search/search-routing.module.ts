import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchResultListComponent } from './search-result-list/search-result-list.component';
import { SearchResultItemComponent } from './search-result-item/search-result-item.component';
import { ModalModule } from '../_modal';

const routes: Routes = [
  { path: 'search-results-list', component: SearchResultListComponent },
  { path: 'search-results-item', component: SearchResultItemComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes), ModalModule],
  exports: [RouterModule],
})
export class SearchRoutingModule {}
