import { Component, OnInit } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { SearchService } from '../search.service';
import { ClassTopic } from '../ClassTopic';
import { ClassSearch } from '../ClassSearch';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import {
  map,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs/operators';

@Component({
  selector: 'app-widget-search-bar',
  templateUrl: './widget-search-bar.component.html',
  styleUrls: ['./widget-search-bar.component.scss'],
})
export class WidgetSearchBarComponent implements OnInit {
  searchResults$: Observable<ClassSearch[]>;
  term$ = new Subject<string>();
  windowOpen$: Observable<boolean>;

  constructor(private searchService: SearchService, private router: Router) {
    this.searchResults$ = this.term$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term) =>
        term.length == 0 ? of([]) : this.searchService.search(term, '!topic')
      )
    );
  }

  ngOnInit(): void {
    this.windowOpen$ = this.searchResults$.pipe(
      map((searchOptionsArr) => (searchOptionsArr.length > 0 ? true : false))
    );
  }

  searchOption(option: ClassSearch) {
    console.log(option);
    let emptyArray: ClassSearch[] = [];
    this.searchService.updateSelectedOptions(emptyArray);
    this.searchService.updateSelectedOption(option);
    this.searchService.isOptionEmpty$ = this.searchService.option$.pipe(
      map((option) => (option.id == null ? true : false))
    );
    this.router.navigate(['/search-results-item']);
  }

  onSubmit(f: NgForm) {
    this.searchService.options$ = this.searchService.search(f.value.search, "class") as Observable<ClassSearch[]>;

    this.searchService.updateSelectedOption({
      id: null,
      description: null,
      title: null,
      relatedTopicIds: null,
    });

    this.searchService.isOptionsEmpty$ = this.searchService.options$.pipe(
      map((options) => (options.length == 0 ? true : false))
    );

    this.router.navigate(['/search-results-list']);
    f.resetForm();
  }

  onblur() {
    this.term$.next('');
  }
}
