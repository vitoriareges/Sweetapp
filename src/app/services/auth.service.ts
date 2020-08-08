import { User } from './../interfaces/user';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afa: AngularFireAuth) { }

  login(user: User){
    return this.afa.signInWithEmailAndPassword(user.email, user.password); // Method from firebase
  }

  register(user: User){
    return this.afa.createUserWithEmailAndPassword(user.email, user.password); // Method from firebase
  }

  getPassword(user: User){
return this.afa.sendPasswordResetEmail(user.email); // method to resend passowrd
  }

  logout(user: User){
    return this.afa.signOut(); // Method from firebase

  }

  getAuth() {
    return this.afa; // Method from firebase to check function once authentication is done

  }


}
