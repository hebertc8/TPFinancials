import {EventEmitter, Injectable} from '@angular/core';
import { ObjTable } from '../services/interfaces';

@Injectable({
    providedIn:'root'
})

export class obsTableFilter{
    datos$ = new EventEmitter<ObjTable>();
    
    constructor(){};
}