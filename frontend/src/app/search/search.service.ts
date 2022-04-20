import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { ClassTopic } from './ClassTopic';
import { ClassSearch } from './ClassSearch';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private SERVER_URL = 'https://zipit-backend.herokuapp.com/class/';

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

  search(q: string, flag: string): Observable<ClassSearch[]> {
    this.http.post(url, {"title": "test", "description": "test"});
    var temp;
    var tmp;
    if (flag == 'topic'){
      temp = "Classes?id=";
    }
    else{
      temp = "all";
    }
    tmp = this.http.get<ClassSearch[]>(this.SERVER_URL + temp);
    console.log(tmp);
    var url = 'https://zipit-backend.herokuapp.com/add/class';
    this.http.post(url, {"title": "test", "description": "test"});
    return this.http.get<ClassSearch[]>(
      this.SERVER_URL + temp,
      {
        headers: {
          "Access-Control-Allow-Origin": "GET, POST, PUT, DELETE, OPTIONS",
        }
      }
    );
  }

  updateSelectedOption(option: ClassSearch) {
    this.selectedOption.next(option);
  }

  updateSelectedOptions(options: ClassSearch[]) {
    this.selectedOptions.next(options);
  }
}
