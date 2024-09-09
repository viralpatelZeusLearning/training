import { Component, Input, OnInit, EventEmitter, Output } from "@angular/core";

@Component({
    selector:'app-filtertext',
    template:`Filter : <input type="text" [(ngModel)]='filter'>`
})
export class FilterTextBox implements OnInit{
    constructor(){}
    ngOnInit(){
        
    }
    private _filter:string="";
    @Input() get filter(){
        return this._filter;
    }
    set filter(value:string){
        this._filter = value;
        this.changed.emit(this.filter)
    }
    @Output() changed: EventEmitter<string> = new EventEmitter<string>;
}