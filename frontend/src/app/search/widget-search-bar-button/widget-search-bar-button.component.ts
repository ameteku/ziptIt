import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ClassSearch } from '../ClassSearch';

@Component({
  selector: 'app-widget-search-bar-button',
  templateUrl: './widget-search-bar-button.component.html',
  styleUrls: ['./widget-search-bar-button.component.scss'],
})
export class WidgetSearchBarButtonComponent implements OnInit {
  constructor(private searchService: SearchService, private router: Router) {}

  ngOnInit(): void {

  }

  onSubmit(f: NgForm) {
    this.searchService.options$ = (this.searchService.search(f.value.search, "topic") as Observable<ClassSearch[]>);

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
}
