import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../_modal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './SignIn';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  title: string;
  description: string;
  username: string;
  password: string;
  email: string;
  url: string;
  respData: User;
  httpOptions;

  constructor(private modalService: ModalService, private http: HttpClient) {
     this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      }),
      observe: 'response'
  };
   }

  ngOnInit(): void {
    this.url = 'https://zipit-backend.herokuapp.com/login';
    this.title = "";
    this.description = "";
    this.username = "";
    this.password = "";
  }
  openModal(id: string) {
    this.modalService.open(id);
}

closeModal(id: string) {
    this.modalService.close(id);
    this.username = "";
    this.password = "";
}

signIn(){
  console.log(this.username);
  console.log(this.password);
  this.http.post<User>(this.url, {"username": this.username, "password": this.password}).subscribe(data => { console.log(data);
    this.delay(2000);
    this.respData = data});
  
  console.log(this.respData);
}

signUp(){
  console.log(this.username);
  console.log(this.password);
  this.username = "";
  this.password = "";
}

delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

}
