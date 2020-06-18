import { Component, OnInit, TemplateRef } from '@angular/core';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CategoriesService } from 'src/app/shared/services/categories.service';
import { ProductsService } from 'src/app/shared/services/products.service';
import { Product } from 'src/app/shared/models/product.model';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import 'firebase/storage';


@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit {
  adminCategories: Array<ICategory> = [];
  categoryName: string;

  adminProducts: Array<IProduct> = [];
  productID: number;
  productCategory: ICategory = {id: 1, nameUA: 'піца', nameEN: 'pizza'};
  productNameUA: string;
  productNameEN: string;
  productDescription: string;
  productWeight: string;
  productPrice: number;
  productImage: string;
  editStatus: boolean;

  // ngx-bootstrap
  modalRef: BsModalRef;

  // firebase
  uploadProgress: Observable<number>;

  constructor(private catService: CategoriesService, private prodService: ProductsService, private modalService: BsModalService,
              private afStorage: AngularFireStorage) { }

  ngOnInit(): void {
    this.getCategories();
    this.getProducts();
  }

  private getCategories(): void {
    this.catService.getJSONCategories().subscribe(
      data => {
        this.adminCategories = data;
      },
      error => { console.log('Category service', error); }
    );
  }

  private getProducts(): void {
    this.prodService.getJSONProducts().subscribe(
      data => {
        this.adminProducts = data;
      },
      error => { console.log('Discount service', error); }
    );
  }

  setCategory(): void {
    const index = this.adminCategories.findIndex(elem => elem.nameEN.toLocaleLowerCase() === this.categoryName.toLocaleLowerCase());
    this.productCategory = this.adminCategories[index];
    console.log(this.productCategory);
  }

  public addProduct(): void {
    const product: IProduct = new Product(1,
                                          this.productCategory,
                                          this.productNameUA,
                                          this.productNameEN,
                                          this.productDescription,
                                          this.productWeight,
                                          this.productPrice,
                                          this.productImage);
    if (this.adminProducts.length > 0) {
      product.id = this.adminProducts.slice(-1)[0].id + 1;
    }
    this.prodService.addJSONProduct(product).subscribe(
      () => {
        this.getProducts();
      }
    );
    this.resetForm();
  }

  public deleteProduct(product: IProduct): void {
    if (confirm('Yes or Not')) {
      this.prodService.deleteJSONProduct(product).subscribe(
        () => {
          this.getProducts();
        }
      );
    }
  }

  public editProduct(template: TemplateRef<any>, product: IProduct): void {
    this.modalRef = this.modalService.show(template);
    this.productCategory = product.category;
    this.productNameUA = product.nameUA;
    this.productNameEN = product.nameEN;
    this.productDescription = product.description;
    this.productWeight = product.weight;
    this.productPrice = product.price;
    this.productImage = product.image;
    this.productID = product.id;
    this.editStatus = true;
  }

  public saveEditProduct(): void {
    const editP: IProduct = new Product( this.productID,
                                          this.productCategory,
                                          this.productNameUA,
                                          this.productNameEN,
                                          this.productDescription,
                                          this.productWeight,
                                          this.productPrice,
                                          this.productImage);
    this.prodService.updateJSONProduct(editP).subscribe(
      () => {
        this.getProducts();
      }
    );
    this.resetForm();
  }

  private resetForm(): void {
    this.productNameUA = '';
    this.productNameEN = '';
    this.productDescription = '';
    this.productWeight = '';
    this.productPrice = null;
    this.productID = null;
    this.editStatus = false;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.editStatus = false;
    this.resetForm();
  }

  uploadFile(event) {
    const file = event.target.files[0];
    const filePath = `images/${this.uuid()}.${file.type.split('/')[1]}`;
    const task = this.afStorage.upload(filePath, file);
    this.uploadProgress = task.percentageChanges();
    task.then( e => {
      this.afStorage.ref(`images/${e.metadata.name}`).getDownloadURL().subscribe( url => {
        this.productImage = url;
      });
    });
  }

  uuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }


}
