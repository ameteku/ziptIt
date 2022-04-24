import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ModalService } from 'src/app/_modal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './SignIn';
import { emit } from 'process';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

@Output() public getAuthStatusChange = new EventEmitter<boolean>();

  httpOptions;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  confirmPassword: string;
  email: string;
  loggedIn: boolean = false;
  isAdmin: boolean = false;
  signupURL: string = 'https://zipit-backend.herokuapp.com/register';
  loginURL: string = 'https://zipit-backend.herokuapp.com/login';
  addClassUrl: string = 'https://zipit-backend.herokuapp.com/add/class';
  title:string;
  description: string;


  constructor(private modalService: ModalService, private http: HttpClient, public appCom: AppComponent) {
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
    this.appCom.isAuthObs.subscribe(loggedIn => this.loggedIn = loggedIn);
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
  this.http.post<User>(this.loginURL, {"username": this.username, "password": this.password}, {...this.httpOptions}).subscribe({
    next:  data => {
      //@ts-ignore ts wierdly says data is not available because I am passing in headers? remove comment to see error 
      if(data.accessLevel[0] == "Regular"){
        alert("Regular user logged in");
        this.getAuthStatusChange.emit(true);
        this.loggedIn = true;
     }
      //@ts-ignore ts wierdly says data is not available because I am passing in headers? remove comment to see error 
     else if(data.accessLevel[0] == "Admin"){
       alert("Admin user logged in");
       this.getAuthStatusChange.emit(true);
       this.loggedIn = true;
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

    this.http.post<User>(this.loginURL, {"username": this.username, "password": this.password}, {
      withCredentials: true
    }).subscribe({
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

  logout(){
    this.getAuthStatusChange.emit(false);
    this.closeModal("logout");
    this.loggedIn = false;
    this.isAdmin = false;
    alert("User has been logged out");
  }

  addClass(){
    this.http.post<User>(this.addClassUrl, {"title": this.title, "description": this.description}).subscribe({
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
