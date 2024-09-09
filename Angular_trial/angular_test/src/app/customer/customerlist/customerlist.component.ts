import { Component, Input, OnInit, Output } from '@angular/core';
import { ICustomer } from '../../shared/interfaces';

@Component({
  selector: 'app-customerlist',
  templateUrl: './customerlist.component.html',
  styleUrls: ['./customerlist.component.css']
})
export class CustomerlistComponent implements OnInit{
  filteredCustomers: any[] = [];
  customerOrderTotal:number=0
  currencyCode: string = 'USD';
  ngOnInit() {

  }
  private _customer:ICustomer[] = [];
  @Input() get customer():ICustomer[]{
    return this._customer;
  }
  set customer(value:ICustomer[]){
    this.filteredCustomers = this._customer = value;
    this.calculateOrders()
  }
  calculateOrders(){
    this.customerOrderTotal=0;
    this.filteredCustomers.forEach((cust:ICustomer)=>{
      this.customerOrderTotal += cust.orderTotal;
    });
  }
  filter(data:string){
    if (data){
      this.filteredCustomers = this.customer.filter((cust:ICustomer)=>{
        return cust.name.toLowerCase().indexOf(data.toLowerCase()) > -1 ||
              cust.city.toLowerCase().indexOf(data.toLowerCase()) > -1 ||
              cust.orderTotal.toString().indexOf(data) > -1;
      })
    }
    else{
      this.filteredCustomers = this.customer;
    }
    this.calculateOrders();
  }
  sort(prop:string){

  }
}
