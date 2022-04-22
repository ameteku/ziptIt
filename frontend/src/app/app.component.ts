import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public loggedIn: boolean = false;

  private _isAuthSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isAuthObs: Observable<boolean> = this._isAuthSubject.asObservable();

  title = 'Search-Module';

  authChanged(status: boolean){
    this.loggedIn = status;
  }
}
