import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service';
import { ModalService } from '../../_modal';
import { ModalModule } from '../../_modal';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-search-result-list',
  templateUrl: './search-result-list.component.html',
  styleUrls: ['./search-result-list.component.scss'],
})
export class SearchResultListComponent implements OnInit {
  topicTitle: string;
  topicDescription: string;

  constructor(public searchService: SearchService, private modalService: ModalService,
    private modalModel: ModalModule) {
    }

  ngOnInit(): void {
    
  }

  showClassTopics(id: string){
    console.log(id);
    this.searchService.search(id, "topic");

  }

  openModal(id: string) {
    this.modalService.open(id);
    this.topicDescription = "";
    this.topicTitle = "";
  }

  closeModal(id: string) {
    this.modalService.close(id);
    this.topicDescription = "";
    this.topicTitle = "";
}
}
