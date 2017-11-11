import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-login-wind',
  templateUrl: './login-wind.component.html',
  styleUrls: ['./login-wind.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginWindComponent implements OnInit {
  hide = true;
  username="";
  expand = false
  items = ['Steak','Steak1','Steak2','Steak3' ]
  
  constructor() { }

  ngOnInit() {
  }

}
