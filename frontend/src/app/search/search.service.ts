import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { SearchOption } from './searchOption';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private SERVER_URL = 'https://zipit-backend.herokuapp.com/class/';

  constructor(private http: HttpClient) {}

  private selectedOption = new BehaviorSubject<SearchOption>({
    id: null,
    description: null,
    title: null,
    relatedTopicIds: null,
  });

  private selectedOptions = new BehaviorSubject<SearchOption[]>([]);

  option$ = this.selectedOption.asObservable();
  options$ = this.selectedOptions.asObservable();

  isOptionEmpty$: Observable<boolean>;

  isOptionsEmpty$: Observable<boolean>;

  search(q: string, flag: string): Observable<SearchOption[]> {
    var temp;
    var tmp;
    if (flag == 'topic'){
      temp = "Classes?id=";
    }
    else{
      temp = "all";
    }
    tmp = this.http.get<SearchOption[]>(this.SERVER_URL + temp);
    console.log(tmp);
    var url = 'https://zipit-backend.herokuapp.com/add/class';
    this.http.post(url, {"title": "test", "description": "test"});
    return this.http.get<SearchOption[]>(
      this.SERVER_URL + temp,
      {
        headers: {
          "Access-Control-Allow-Origin": "GET, POST, PUT, DELETE, OPTIONS",
        }
      }
    );
  }

  updateSelectedOption(option: SearchOption) {
    this.selectedOption.next(option);
  }

  updateSelectedOptions(options: SearchOption[]) {
    this.selectedOptions.next(options);
  }
}
