import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CustomerComponent } from './customer.component';
import { CustomerlistComponent } from './customerlist/customerlist.component';
import { FilterTextBox } from './customerlist/filtertext.components';
import { SharedModule } from '../shared/shared.module';
@NgModule({
    imports : [CommonModule , FormsModule , SharedModule],
    declarations:[CustomerComponent,CustomerlistComponent,FilterTextBox],
    exports:[CustomerComponent]
})
export class CustomerModule { }