import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  basket: Subject<any> = new Subject<any>();
  constructor() { }
}
