import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../_modal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../header/SignIn';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  imageSrc = 'assets/akron.png';
  title: string;
  addClassURL: string;
  passwordMatch: boolean = false;
  description: string;
  username: string;
  password: string;
  email: string;
  loginURL: string;
  respData: User;
  httpOptions;
  firstname: string;
  lastname: string;
  isAdmin: boolean = true;
  isPostComplete: boolean = false;
  confirmPassword: string;
  signupURL: string = 'https://zipit-backend.herokuapp.com/register';

  constructor(private modalService: ModalService, private http: HttpClient) {
     this.httpOptions = {
      headers: new HttpHeaders({
        "Access-Control-Allow-Origin": "GET, POST, PUT, DELETE, OPTIONS",
      }),
      observe: 'response',
      withCredentials: true,
      crossDomain: true 
    };
   }

  ngOnInit(): void {
    this.loginURL = 'https://zipit-backend.herokuapp.com/login';
    this.addClassURL = 'https://zipit-backend.herokuapp.com/add/class';

    this.title = "";
    this.description = "";
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
    this.title = "";
    this.description = "";
}

closeModal(id: string) {
    this.modalService.close(id);
    this.username = "";
    this.password = "";
}

signIn(){
  console.log(this.username);
  console.log(this.password);

  this.http.post<User>(this.loginURL, {"username": this.username, "password": this.password},
   {...this.httpOptions}
    ).subscribe({
    next: data => {
      if(data.accessLevel[0] == "Regular"){
        alert("Regular user logged in");
     }
     else if(data.accessLevel[0] == "Admin"){
       alert("Admin user logged in");
       this.isAdmin = true;
     }
     this.closeModal("SignIn");
  }, 
  error: error => {
    console.error('There was an error!', error);
    alert("Invalid username or password");
}
  });
}

signUp(){
  while (this.password != this.confirmPassword){
    alert("Passwords do not match");
    this.password = "";
    this.confirmPassword = "";
  }

  this.http.post<User>(this.loginURL, {"username": this.username, "password": this.password}, 
   this.httpOptions
  ).subscribe({
    next: data => {
      alert("User already exists!");
      this.firstname="";
      this.lastname="";
      this.username ="";
      this.password ="";
      this.confirmPassword="";
      this.email="";
  }, 
  error: error => {
    this.http.post<User>(this.signupURL, {"username": this.username, "password": this.password, "firstname": this.firstname, "lastname": this.lastname, "email": this.email}).subscribe({
      next: data => {
        alert("User created!");
        this.firstname="";
        this.lastname="";
        this.username ="";
        this.password ="";
        this.confirmPassword="";
        this.email="";
    },
    error: error => {
      console.error('There was an error!', error);
      alert("Invalid username or password");
    }
      });
    
}
  });
}

  addClass(){
    this.http.post<User>(this.addClassURL, {"title": this.title, "description": this.description}).subscribe({
      next: data => {
        alert("Class added!");
        this.title="";
        this.description="";
    }, 
    error: error => {
      console.error('There was an error!', error);
      alert("There was an error class could not be added");
  }
    });
  }


}
