import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ModalService } from 'src/app/_modal';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
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
  
  @Input() currentUser;
  @Output() OutputToParent = new EventEmitter<any>();


  constructor(private modalService: ModalService, private http: HttpClient, public appCom: AppComponent) {
    this.httpOptions = {
      headers: new HttpHeaders({
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        "Access-Control-Allow-Credentials": "true"
      }),
      observe: 'response',
      withCredentials: true,
      crossDomain: true 
    };
   }

  ngOnInit(): void {
    this.isAdmin = localStorage.getItem("isAdmin") == "true" ? true : false;
    this.username = localStorage.getItem("username");
    this.appCom.isAuthObs.subscribe(loggedIn => this.loggedIn = loggedIn);
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
  this.http.post<User>(this.loginURL, {"username": this.username, "password": this.password}, this.httpOptions).subscribe({
    
    next:  (data: HttpResponse<User> )=> {
        if(data.body.accessLevel[0] == "Regular"){
        alert("Regular user logged in");
     }
     else if(data.body.accessLevel[0] == "Admin"){
       alert("Admin user logged in");
       this.isAdmin = true;
       localStorage.setItem("isAdmin", "true");
     }
     this.loggedIn = true;
     localStorage.setItem("loggedIn", "true");
     localStorage.setItem("username", this.username);
     this.getAuthStatusChange.emit(true);
     this.OutputToParent.emit(this.username);
     this.closeModal("SignIn");
  }, 
  error: error => {
    console.error('There was an error!', error);
    alert("Invalid username or password");
    this.username = "";
    this.password = "";
    this.closeModal('SignIn');
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
    this.OutputToParent.emit(null);
    this.closeModal("logout");
    this.loggedIn = false;
    this.isAdmin = false;
    localStorage.clear();
    alert("User has been logged out");
  }

  addClass(){
    this.http.post(this.addClassUrl, {"title": this.title, "description": this.description}, {
      headers: {
        ""
      }
    }).subscribe({
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
