import { Component, OnInit, ViewChild } from '@angular/core';
import {
  LoadingController,
  ToastController,
  NavController,
  IonSlides,
} from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/interfaces/product';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.page.html',
  styleUrls: ['./crud.page.scss'],
})
export class CrudPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  private loading: any;
  private listproducts = new Array<Product>();
  private pSubscription: Subscription;
  private productId: string = null;
  public product: Product = {};

  constructor(

    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private route: Router,
    private authService: AuthService,
    private pService: ProductService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController
  ) {
    this.pSubscription = this.pService.readProducts().subscribe(data => {
    this.listproducts = data; // will list products
    });
    this.productId = this.activatedRoute.snapshot.params.id; // list id for products

    if (this.productId) {this.loadProduct(); }
  }

  segmentChanged(event: any) {
    if (event.detail.value === 'create'){
      this.slides.slidePrev();
    } else {
      this.slides.slideNext();
    }
  }

  loadProduct() {
    this.pSubscription = this.pService.readProductsId(this.productId).subscribe(data =>{
      this.product = data;
    });
  }

  async createProduct() { // function to comunicate with firebase to create or update a product by using product service
    await this.presentLoading();

    this.product.userId = (await this.authService.getAuth().currentUser).uid;

    if (this.productId) { // if the id already exists
      try {
        await this.pService.updateProduct(this.productId, this.product);
        await this.loading.dismiss(); // this method will update a product in case it already exists in database


      } catch (error) {
        this.presentToast('Could not create product');
        this.loading.dismiss();
      }
    } else {
      this.product.createdAt = new Date().getTime();

      try {
        await this.pService.createProducts(this.product);
        await this.loading.dismiss();


      } catch (error) {
        this.presentToast('Error when trying to save');
        this.loading.dismiss();
      }
    }
  }
  ngOnInit() {}

  async deleteProduct(id: string) {
    try {
      await this.pService.deleteProduct(id);
    } catch (error) {
      this.presentToast('There was an error when trying to delete');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 4000 });
    toast.present();
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Please wait...' });
    return this.loading.present();
  }
}
