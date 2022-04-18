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
  isAdmin: boolean = false;

  constructor(private modalService: ModalService, private http: HttpClient) {
     this.httpOptions = {
      headers: new HttpHeaders({
        "Access-Control-Allow-Origin": "GET, POST, PUT, DELETE, OPTIONS",
      }),
      observe: 'response',
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
    this.username = "";
    this.password = "";
}

closeModal(id: string) {
    this.modalService.close(id);
    this.username = "";
    this.password = "";
}

signIn(){
  console.log(this.username);
  console.log(this.password);

  var test = this.http.post<User>(this.url, {"username": this.username, "password": this.password}).subscribe(data => { 
    if (data.accessLevel[0] == "Regular"){
      alert("Regular User Logged in");
    }
    else if(data.accessLevel[0] == "Admin"){
      alert("Admin User Logged In");
      this.isAdmin = true;
    }
  });
if (!test.closed){
  alert("user not found");
}
console.log(test);
}

signUp(){
  console.log(this.username);
  console.log(this.password);
  this.username = "";
  this.password = "";
}


}
