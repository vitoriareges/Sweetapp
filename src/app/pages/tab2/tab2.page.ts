import { Profile } from './../../interfaces/profile';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';
import { Subscription } from 'rxjs';
import { ProfileService } from 'src/app/services/profile.service';
import { ViewChild } from '@angular/core';

 
@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  public userLogin: User = {};
  public userRegister: User = {};
  public loading: any;
  private listprofiles = new Array<Profile>();
  private pSubscription: Subscription;
  private activatedRoute: ActivatedRoute;
  private navCtrl: NavController;


  constructor(private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private route: Router,
              private authService: AuthService,
              private pService: ProfileService) {
                this.pSubscription = this.pService.readProfiles().subscribe(data => {
                  this.listprofiles = data;
                });
                
               } 

    profile() {
      this.route.navigate(['/user-profile']);
    }
  ngOnInit() {

  }

  async logout(){ // method to resend password to user
    await  this.presentLoading();

    try {
    await this.authService.logout;
    this.route.navigate(['/login']);
  } catch (error){
    console.error(error);
    this.presentToast(error.message);
  }finally{
    this.loading.dismiss(); // remove message of loading
  }
    }

    async presentLoading() { // Method from Ionic for loading function when waiting for authentication
      this.loading = await this.loadingCtrl.create({
        cssClass: 'my-custom-class',
        message: 'Please wait...',
      });
      return this.loading.present();

    }

    async presentToast(message: string) {  // Method from Ionic for loading function when presenting an error during authentication
      const toast = await this.toastCtrl.create({
        message,
        duration: 4000 // i did some tests and in my opinion 4s is the best time to the user read what kind of error was presented
      });
      toast.present();
    }
  }
