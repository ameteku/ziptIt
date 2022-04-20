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
  private SERVER_URL = 'http://localhost:3000/';

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

  search(q: string, flag: string): Observable<any> {
    var temp;
    if (flag == 'topic'){
      console.log("test2");
      temp = "Topics?classId_like=" + q;
      return this.http.get<ClassTopic[]>(this.SERVER_URL + temp + q);
    }
    else{
      temp = "Classes?title_like=";
    }
    return this.http.get<ClassSearch[]>(
      this.SERVER_URL + temp + q,
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
