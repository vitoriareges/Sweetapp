
import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})

export class AuthGuard implements CanActivate {
  constructor(private aS: AuthService, private router: Router) {}

  canActivate(): Promise<boolean>{
    return new Promise(resolve => {
      this.aS.getAuth().onAuthStateChanged(user => { // This will check if the user login status has changed
        if (!user) { this.router.navigate (['/login']); } // if user is not logged it will redict it to the login page
        resolve (user ? true : false);
      });
    });
  }
}
