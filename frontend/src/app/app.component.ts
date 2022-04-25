import { Component, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HeaderComponent } from './shared/header/header.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public loggedIn: boolean = false;
  public currentUser: string = null;

  private _isAuthSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isAuthObs: Observable<boolean> = this._isAuthSubject.asObservable();

  @ViewChild('headerUser', {static:false}) headerUser:
  HeaderComponent;

  receiveFromChild:string=null;

  GetUser(newUser){
    this.currentUser = newUser;
  }

  title = 'Search-Module';

  authChanged(status: boolean){
    this.loggedIn = status;
  }
}
