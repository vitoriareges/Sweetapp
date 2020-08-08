import { Profile } from './../../interfaces/profile';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  private loading: any;
  private listprofiles = new Array<Profile>();
  private pSubscription: Subscription; 
  private profileId: string = null;
  public profile: Profile = {};

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private route: Router,
    private authService: AuthService,
    private pService: ProfileService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController) {
      this.pSubscription = this.pService.readProfiles().subscribe(data => {
      this.listprofiles = data; // will list products
      });
      this.profileId = this.activatedRoute.snapshot.params.id; // list id for products

      if (this.profileId) {this.loadProfile(); }
    }

  ngOnInit() {
  }

  loadProfile() {

    this.pSubscription = this.pService.readProfilesId(this.profileId).subscribe(data => {
      this.profile = data;
    });
  }

  async createAccount() { // function to comunicate with firebase to create or update a product by using product service
    await this.presentLoading();

    this.profile.userId = (await this.authService.getAuth().currentUser).uid;

    this.route.navigate(['/tab2']);

    if (this.profileId) { // if the id already exists
      try {
        await this.pService.updateProfile( this.profileId, this.profile);
        await this.loading.dismiss(); // this method will update a product in case it already exists in database


      } catch (error) {
        this.presentToast('Could not create product');
        this.loading.dismiss();
      }
    } else {
      this.profile.createdAt = new Date().getTime();

      try {
        await this.pService.createAccount(this.profile);
        await this.loading.dismiss();


      } catch (error) {
        this.presentToast('Error when trying to save');
        this.loading.dismiss();
      }
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
