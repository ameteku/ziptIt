import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/_modal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './SignIn';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  httpOptions;
  loginURL:string;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  confirmPassword: string;
  email: string;


  constructor(private modalService: ModalService, private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({
        "Access-Control-Allow-Origin": "GET, POST, PUT, DELETE, OPTIONS",
      }),
      observe: 'response',
  };
   }

  ngOnInit(): void {
    this.loginURL = 'https://zipit-backend.herokuapp.com/login';
    this.username = "";
    this.password = "";
    this.firstname = "";
    this.lastname ="";
  }

  openModal(id: string) {
    this.modalService.open(id);
    this.username = "";
    this.password = "";
    this.firstname = "";
    this.lastname = "";
    this.confirmPassword = "";
    this.email = "";
}

closeModal(id: string) {
  this.modalService.close(id);
  this.username = "";
  this.password = "";
  this.firstname = "";
  this.lastname = "";
  this.confirmPassword = "";
  this.email = "";
}

signIn(){

}

signUp(){
  
}

}
