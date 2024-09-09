import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
@Component({
  selector:'app-root',
  template:`
  <app-customer></app-customer>
  `
})
export class AppComponent implements OnInit{
  constructor() {}
  ngOnInit(){
  }
}
