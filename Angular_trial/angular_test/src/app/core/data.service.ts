import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http"

import { catchError, Observable, throwError } from "rxjs";
import { ICustomer } from "../shared/interfaces";

@Injectable()
export class DataService {
    baseUrl: string = "assets/";
    constructor(private http:HttpClient) { }
    getCustomers(): Observable<ICustomer[]>{
        return this.http.get<ICustomer[]>(this.baseUrl + 'customer.json')
        .pipe(
            catchError(this.handleError)
        )
    }

    private handleError(error: any) {
        console.error('server error:', error);
        if (error.error instanceof Error) {
            const errMessage = error.error.message;
            return throwError (errMessage);
            // Use the following instead if using lite-server
            // return Observable.throw(err.text() || 'backend server error');
        }
        return throwError (error || 'Node.js server error');
    }
}