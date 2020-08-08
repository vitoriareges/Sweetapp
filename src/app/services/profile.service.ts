import { Profile } from './../interfaces/profile';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';



@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private pCollection: AngularFirestoreCollection<Profile>; // this funtion will be used to call the collection in the methods for crud


  constructor(private afs: AngularFirestore) {
    this.pCollection = this.afs.collection<Profile>('Profiles');
  }

// bellow the methods to do the crud:
// by general convention in general development and coding, i should use the names:
// get for read
// add for create
// although for this project i will use the words related to CRUD - create , read , update and delete

createAccount(profile: Profile){
  return this.pCollection.add(profile); // function to add an item to the firestore cloud from firestore library

}

readProfiles(){

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

  readProfilesId(id: string){
    return this.pCollection.doc<Profile>(id).valueChanges();
  }

  updateProfile(id: string , product: Profile){
    return this.pCollection.doc<Profile>(id).update(product);
  }
}
