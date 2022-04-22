import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TopicResult } from './TopicResult';

@Component({
  selector: 'app-topic-page',
  templateUrl: './topic-page.component.html',
  styleUrls: ['./topic-page.component.scss']
})
export class TopicPageComponent implements OnInit {
  url = 'https://zipit-backend.herokuapp.com/topic/all/';
  className: string;
  id: string;
  sub;
  results: TopicResult;

  constructor(private _Activatedroute:ActivatedRoute, private _router:Router, private http: HttpClient) { 
    this.sub=this._Activatedroute.paramMap.subscribe(params => { 
      console.log(params);
       this.id = params.get('id');    
   });
  }

  ngOnInit(): void {
    var newUrl = this.url + this.id;
    this.http.get<any>(newUrl).subscribe(data => {
      this.results = data;
    });
  }

  onBack(): void {
    this._router.navigate(['/search-results-list']);
  }

  test(){
    console.log("test");
  }

}
