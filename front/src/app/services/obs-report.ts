import {EventEmitter, Injectable} from '@angular/core';
import { ObjReport } from './interfaces';

@Injectable({
    providedIn:'root'
})

export class obsReport{
    datos$ = new EventEmitter<ObjReport>();
    
    constructor(){};
}