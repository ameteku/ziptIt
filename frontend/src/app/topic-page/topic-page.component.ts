import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TopicResult } from './TopicResult';
import { ModalService } from '../_modal';
import { AppComponent } from '../app.component';
import * as internal from 'events';
import { NumberValueAccessor } from '@angular/forms';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-topic-page',
  templateUrl: './topic-page.component.html',
  styleUrls: ['./topic-page.component.scss']
})
export class TopicPageComponent implements OnInit {

  url = 'https://zipit-backend.herokuapp.com/topic/all/';
  linkurl = 'https://zipit-backend.herokuapp.com/link/all/';
  postLink = 'https://zipit-backend.herokuapp.com/add/link/';
  className: string;
  classTitle: string;
  id: string;
  sub;
  results: TopicResult;
  topicTitle: string;
  topicDescription: string;
  linkTitle: string;
  linkDescription: string;
  actualLink: string;
  httpOptions;
  rating: string;
  links: [];

  constructor(private _Activatedroute:ActivatedRoute, private _router:Router, private http: HttpClient, private modalService: ModalService, public appCom: AppComponent) { 
    this.sub=this._Activatedroute.paramMap.subscribe(params => { 
      console.log(params);
       this.id = params.get('id'); 
       this.classTitle = params.get('title');   
       this.httpOptions = {
        headers: new HttpHeaders({
          "Access-Control-Allow-Origin": "GET, POST, PUT, DELETE, OPTIONS",
        }),
        observe: 'response',
        };
   });
  }

  ngOnInit(): void {
    this.links = null;
    var newUrl = this.url + this.id;
    this.http.get<any>(newUrl).subscribe(data => {
      this.results = data;
    });
  }

  onBack(): void {
    this._router.navigate(['/search-results-list']);
  }

  getLinks(topicId: string){
    this.http.get<any>(this.linkurl + topicId).subscribe(data => {
      this.links = data;
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
    this.closeModal('AddTopic');
    this.http.post<any>(URL, body).subscribe({
      next: data => {
        alert("Topic added!");
        this.topicTitle="";
        this.topicDescription="";
      },
      error: error => {
        console.error('There was an error!', error);
        alert('There was an error Topic could not be added');
      }
      
    });
  }

  closeModal(id: string){
    this.modalService.close(id);
    this.topicTitle = "";
    this.topicDescription = "";
    this.linkTitle = "";
    this.actualLink = "";
    this.linkDescription = "";
    this.rating = '';
  }

  openModal(id: string){
    this.modalService.open(id);
    this.topicTitle = "";
    this.topicDescription = "";
    this.linkDescription = "";
    this.linkTitle = "";
    this.actualLink = "";
    this.rating = "";
  }

  addLink(classId: string, topicId: string){
    var body = {
      "classId": classId,
      "topicId": topicId,
      "link": this.actualLink,
      "title": this.linkTitle,
      "description": this.linkDescription
    };
    console.log(body);
    this.http.post<any>("https://zipit-backend.herokuapp.com/add/link/", body, this.httpOptions).subscribe({
      next: data => {
        alert("Link added!");
        this.linkTitle="";
        this.linkDescription="";
        this.actualLink="";
      },
      error: error => {
        console.error('There was an error!', error);
        alert('There was an error Link could not be added');
      }
      
    });
  }

  calcRating(param: any): any{
    if (param.length == 0){
      return "no ratings";
    }
    var total: number = 0;
    for(let i=0; i < param.length; i++){
      total += parseInt(param[i]);
    }
    var avg = total/param.length;
    var rounded = Math.round(avg * 10) / 10;
    return rounded;
  }

  submitRating(linkID: any){
    var url = 'https://zipit-backend.herokuapp.com/add-rating';
    var body = {
      'rating' : (document.getElementById('rating') as HTMLInputElement).value,
      'username' : this.appCom.currentUser,
      'linkId' : linkID
    };
    console.log(body);

    this.http.post<any>(url, body).subscribe({
      next: data =>{
        alert("Rating Submitted!");
      },
      error: error => {
        console.error('There was an errorr!', error);
        alert('There was an error rating could not be submitted.');
      }
    });
  }
}
