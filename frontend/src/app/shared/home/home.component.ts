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
  isAdmin: boolean = false;
  isPostComplete: boolean = false;
  confirmPassword: string;
  signupURL: string = 'https://zipit-backend.herokuapp.com/register';

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
}

closeModal(id: string) {
    this.modalService.close(id);
    this.username = "";
    this.password = "";
}

signIn(){
  console.log(this.username);
  console.log(this.password);

  var test = this.http.post<User>(this.loginURL, {"username": this.username, "password": this.password}).subscribe({
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
  //   if (data.accessLevel[0] == "Regular"){
  //     alert("Regular User Logged in");
  //     this.isPostComplete = true;
  //   }
  //   else if(data.accessLevel[0] == "Admin"){
  //     alert("Admin User Logged In");
  //     this.isAdmin = true;
  //     this.isPostComplete = true;
  //   }
  // });

  // if(test.)
  // if (!test.closed && !this.isPostComplete){
  //   alert("Invalid Username or Password");
  // }
  // this.closeModal('SignIn');
}

signUp(){
  while (this.password != this.confirmPassword){
    alert("Passwords do not match");
    this.password = "";
    this.confirmPassword = "";
  }

  this.http.post<User>(this.loginURL, {"username": this.username, "password": this.password}).subscribe({
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


}
