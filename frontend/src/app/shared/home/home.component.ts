import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../_modal';

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

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
    this.title = "Enter a title here";
    this.description = "Enter a description here";
    this.username = "";
    this.password = "";
  }
  openModal(id: string) {
    this.modalService.open(id);
}

closeModal(id: string) {
    this.modalService.close(id);
}

signIn(){
  console.log(this.username);
  console.log(this.password);
  this.username = "";
  this.password = "";
}

}
