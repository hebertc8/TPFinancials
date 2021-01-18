import {EventEmitter, Injectable} from '@angular/core';
import { ObjSelectcgp } from './interfaces';

@Injectable({
    providedIn:'root'
})

export class obsselectcgp{
    datos$ = new EventEmitter<ObjSelectcgp>();
    
    constructor(){};
}