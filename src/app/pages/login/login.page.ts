import { AuthService } from './../../services/auth.service';
import { User } from './../../interfaces/user';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, LoadingController, ToastController } from '@ionic/angular';
import { NativeKeyboard } from '@ionic-native/native-keyboard/ngx';
import { Router } from '@angular/router';

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
            private router: Router,
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

      this.router.navigate(['/home']);
    } catch (error){
      console.error(error);
      this.presentToast(error.message);
    }finally{
      this.loading.dismiss(); // remove message of loading
    }
  }

  // tslint:disable-next-line: max-line-length
  async register(){ // Method to register user, with Firebase authentication working and showing messages in case of errror like invalid email or email already registered
    await this.presentLoading();

    try {
      await this.authService.register(this.userRegister);

    } catch (error){
      console.error(error);
      this.presentToast(error.message);
    }finally{
      this.loading.dismiss(); // remove message of loading
    }
  }

  async forgot(){ // method to resend password to user
  await  this.presentLoading();

  try {
  await this.authService.getPassword(this.userLogin);

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
