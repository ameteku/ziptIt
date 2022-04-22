import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-topic-page',
  templateUrl: './topic-page.component.html',
  styleUrls: ['./topic-page.component.scss']
})
export class TopicPageComponent implements OnInit {
  className: string;
  id: string;
  sub;

  constructor(private _Activatedroute:ActivatedRoute, private _router:Router,) { 
    this.sub=this._Activatedroute.paramMap.subscribe(params => { 
      console.log(params);
       this.id = params.get('id');    
   });
  }

  ngOnInit(): void {

  }

}
