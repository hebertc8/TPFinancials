import {EventEmitter, Injectable} from '@angular/core';
import { ObjSelectcgp } from './interfaces';

@Injectable({
    providedIn:'root'
})

export class obscgpmain{
    datos$ = new EventEmitter<boolean>();
    
    constructor(){};
}