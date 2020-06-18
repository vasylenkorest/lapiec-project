import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/shared/services/orders.service';
import { IProduct } from 'src/app/shared/interfaces/product.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  myBasket: Array<IProduct> = [];
  totalPrice = 0;
  constructor(private orderService: OrdersService) { }

  ngOnInit(): void {
    this.checkBasket();
    this.getLocalStorage();
  }

  private checkBasket(): void {
    this.orderService.basket.subscribe(
      () => {
        this.getLocalStorage();
      }
    );
  }

  private getLocalStorage(): void {
    if (localStorage.length > 0 && localStorage.getItem('products')) {
      this.myBasket = JSON.parse(localStorage.getItem('products'));
      this.totalPrice = this.myBasket.reduce((total, product) => total + (product.price * product.count), 0);
    }
  }

}
