import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
private pCollection: AngularFirestoreCollection<Product>; // this funtion will be used to call the collection in the methods for crud

constructor(private afs: AngularFirestore) {
  this.pCollection = this.afs.collection<Product>('Products');
}

// bellow the methods to do the crud:
// by general convention in general development and coding, i should use the names:
// get for read
// add for create
// although for this project i will use the words related to CRUD - create , read , update and delete

createProducts(product: Product){
  return this.pCollection.add(product); // function to add an item to the firestore cloud from firestore library

}

// the snapshot function will show a 'picture' from the cloud collection
// pipe will check the infos
readProducts(){

return this.pCollection.snapshotChanges().pipe(
map(actions => {
  return actions.map(a => {
    const data = a.payload.doc.data(); // payload is a propert for ductment change function related to the snapshot from firebase
    const id = a.payload.doc.id; // this payload will also get the id for the document (product in the cloud)
    return { id, ...data };
  });
})
);
}

readProductsId(id: string){
  return this.pCollection.doc<Product>(id).valueChanges();
}

updateProduct(id: string , product: Product){
  return this.pCollection.doc<Product>(id).update(product);
}

deleteProduct(id: string){
  return this.pCollection.doc(id).delete();
}


}
