import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClassSearch } from '../ClassSearch';

@Component({
  selector: 'app-search-result-list',
  templateUrl: './search-result-list.component.html',
  styleUrls: ['./search-result-list.component.scss'],
})
export class SearchResultListComponent implements OnInit {
  constructor(public searchService: SearchService) {}

  ngOnInit(): void {}

  showClassTopics(id: string){
    // console.log(id);
    // this.searchService.search(id, "topic");
    this.searchService.options$ = this.searchService.search(id, "class") as Observable<ClassSearch[]>;
  }
}
