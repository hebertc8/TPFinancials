import {EventEmitter, Injectable} from '@angular/core';
import { ObjSelect } from './interfaces';

@Injectable({
    providedIn:'root'
})

export class obsselect{
    datos$ = new EventEmitter<ObjSelect>();
    
    constructor(){};
}