import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/interfaces/product';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  private loading: any;
  private listproducts = new Array<Product>();
  private pSubscription: Subscription;


  constructor(private pService: ProductService) {
    this.pSubscription = this.pService.readProducts().subscribe(data => {
      this.listproducts = data;
    });
   }

  ngOnInit() {
  }


}
