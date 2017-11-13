import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-main-wind',
  templateUrl: './main-wind.component.html',
  styleUrls: ['./main-wind.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MainWindComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
  }

}
