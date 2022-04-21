import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { ClassTopic } from './ClassTopic';
import { ClassSearch } from './ClassSearch';
import { BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private SERVER_URL = 'http://zipit-backend.herokuapp.com/';

  constructor(private http: HttpClient) {}

  private selectedOption = new BehaviorSubject<ClassSearch>({
    id: null,
    description: null,
    title: null,
    relatedTopicIds: null,
  });

  private selectedOptions = new BehaviorSubject<ClassSearch[]>([]);

  option$ = this.selectedOption.asObservable();
  options$ = this.selectedOptions.asObservable();

  isOptionEmpty$: Observable<boolean>;

  isOptionsEmpty$: Observable<boolean>;

  search(q: string, flag: string,): Observable<(ClassTopic | ClassSearch)[]> {
    var temp;
    if (flag == 'topic'){
      console.log("test2");

      temp = "topic/all/"+ q;
      console.log(temp);
      return this.http.get<ClassTopic[]>(this.SERVER_URL + temp);
    }
    else{
      temp = "class/all";
    }

    const result = this.http.get<ClassSearch[]>(this.SERVER_URL + temp);
    return result.pipe(map(result => result.filter(resultItem => resultItem.title.length > q.length ? (resultItem.title.indexOf(q) != -1) : (q.indexOf(resultItem.title) != -1))));
  }

  updateSelectedOption(option: ClassSearch) {
    this.selectedOption.next(option);
  }

  updateSelectedOptions(options: ClassSearch[]) {
    this.selectedOptions.next(options);
  }
}
