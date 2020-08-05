import { AuthService } from './../../services/auth.service';
import { User } from './../../interfaces/user';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, LoadingController, ToastController } from '@ionic/angular';
import { NativeKeyboard } from '@ionic-native/native-keyboard/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
@ViewChild(IonSlides) slides: IonSlides;
public userLogin: User = {};
public userRegister: User = {};
public loading: any;

constructor(private keyboard: NativeKeyboard,
            private loadingCtrl: LoadingController,
            private toastCtrl: ToastController,
            private authService: AuthService) { }

  ngOnInit() {
  }

  segmentChanged(event: any) {
    if (event.detail.value === 'login'){
      this.slides.slidePrev();
    } else {
      this.slides.slideNext();
    }
  }

  async login(){
    await this.presentLoading();

    try {
      await this.authService.login(this.userLogin);

    } catch (error){
      console.error(error);
      this.presentToast(error.message);
    }finally{
      this.loading.dismiss();
    }
  }

  async register(){
    await this.presentLoading();

    try {
      await this.authService.register(this.userRegister);

    } catch (error){
      console.error(error);
      this.presentToast(error.message);
    }finally{
      this.loading.dismiss();
    }
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    return this.loading.present();

  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 4000
    });
    toast.present();
  }
}
