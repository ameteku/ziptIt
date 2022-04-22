import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TopicResult } from './TopicResult';
import { ModalService } from '../_modal';

@Component({
  selector: 'app-topic-page',
  templateUrl: './topic-page.component.html',
  styleUrls: ['./topic-page.component.scss']
})
export class TopicPageComponent implements OnInit {
  url = 'https://zipit-backend.herokuapp.com/topic/all/';
  linkurl = 'https://zipit-backend.herokuapp.com/link/all/';
  className: string;
  classTitle: string;
  id: string;
  sub;
  results: TopicResult;
  topicTitle: string;
  topicDescription: string;

  constructor(private _Activatedroute:ActivatedRoute, private _router:Router, private http: HttpClient, private modalService: ModalService) { 
    this.sub=this._Activatedroute.paramMap.subscribe(params => { 
      console.log(params);
       this.id = params.get('id'); 
       this.classTitle = params.get('title');   
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

  test(topicId: string){
    this.http.get<any>(this.linkurl + topicId).subscribe(data => {
      console.log(topicId);
      console.log(data);
    });
  }

  addTopic(classID: string){
    var URL = 'https://zipit-backend.herokuapp.com/add/topic';
    var body = {
      "title": this.topicTitle,
      "description": this.topicDescription,
      "class_id": classID
    };
    this.closeModal('addTopic');
    this.http.post(URL, body);
  }

  closeModal(id: string){
    this.modalService.close(id);
    this.topicTitle = "";
    this.topicDescription = "";
  }

  openModal(id: string){
    this.modalService.open(id);
    this.topicTitle = "";
    this.topicDescription = "";
  }

}
