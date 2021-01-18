import {EventEmitter, Injectable} from '@angular/core';
import { ObjSelect } from './interfaces';

@Injectable({
    providedIn:'root'
})

export class obsselectHeader{
    datos$ = new EventEmitter<ObjSelect>();
    
    constructor(){};
}