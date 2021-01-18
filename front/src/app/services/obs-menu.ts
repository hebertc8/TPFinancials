import {EventEmitter, Injectable} from '@angular/core';


@Injectable({
    providedIn:'root'
})

export class obsmenu{
    datos$ = new EventEmitter<String>();
    
    constructor(){};
}