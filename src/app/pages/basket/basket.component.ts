import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/shared/services/orders.service';
import { IProduct } from 'src/app/shared/interfaces/product.interface';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {
  orders: Array<IProduct> = [];
  userName: string;
  userPhone: string;
  userCity: string;
  userStreet: string;
  userHouse: string;
  totalPayment: string;
  userComment: string;
  totalPrice: number;
  constructor(private orderService: OrdersService) { }

  ngOnInit(): void {
    this.checkBasket();
  }

  private checkBasket(): void {
    if (localStorage.length > 0 && localStorage.getItem('products')) {
      this.orders = JSON.parse(localStorage.getItem('products'));
    }
  }

  public orderCount(product: IProduct, status: boolean): void {
    if (status) {
      product.count++;
    }
    else {
      if (product.count > 1) {
        product.count--;
      }
    }
    this.total();
    this.updateLocalStorage();
  }

  public deleteOrder(product: IProduct) {
    const index = this.orders.findIndex(prod => prod.id === product.id);
    this.orders.splice(index, 1);
    this.total();
    this.updateLocalStorage();
  }

  private updateLocalStorage() {
    localStorage.setItem('products', JSON.stringify(this.orders));
    this.orderService.basket.next(this.orders);
  }

  private total() {
    this.totalPrice = this.orders.reduce((total, elem) => {
      return total + (elem.price * elem.count);
    }, 0);
  }

}
