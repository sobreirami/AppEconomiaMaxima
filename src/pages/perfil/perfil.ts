import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, ToastController,
  Platform, LoadingController, Loading } from 'ionic-angular';
import { Camera, File, Transfer, FilePath } from 'ionic-native';
import { DbUsuarios } from '../../providers/db-usuarios'

declare var cordova: any;

@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html'
})
export class PerfilPage {

  lastImage: string = null;
  loading: Loading;
  db: any;
  username: any;
  email: any;
  usuario: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public platform: Platform,
    public loadingCtrl: LoadingController
  ) {

    this.db = new DbUsuarios();
    this.username = '';
    this.email = '';
  }

  public load() {
    this.db.getUser().then((result) => {
      this.username = result.username;
      this.email = result.email;
      if(result.imagem) {
        this.lastImage = result.imagem;
      }
    });
  }
  public salvar() {
    this.usuario = {
      username: this.username,
      email: this.email,
      imagem: this.lastImage
    };
    console.log(this.usuario);
    this.db.editUser(this.usuario).then((result) => {
      this.presentToast('Perfil alterado com sucesso');
      this.load();
    }, (error) => {
      console.log(error);
    });
  }

  public fotoUser() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Foto de perfil',
      buttons: [
        {
          text: 'Câmera',
          icon: 'camera',
          handler: () => {
            this.takePicture(Camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Galeria',
          icon: 'image',
          handler: () => {
            this.takePicture(Camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Cancelar',
          icon: 'arrow-back',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  public takePicture(sourceType) {
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    Camera.getPicture(options).then((imagePath) => {
      if(sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
        FilePath.resolveNativePath(imagePath).then(filePath => {
          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
          let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1,
            imagePath.lastIndexOf('?'));
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      console.log('Nenhuma imagem selecionada');
    });
  }

  private createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  n + ".jpg";
    return newFileName;
  }

  private copyFileToLocalDir(namePath, currentName, newFileName) {
    File.copyFile(namePath, currentName,
       cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      console.log('Copiado');
      console.log(this.pathForImage(this.lastImage));
    }, (error) => {
      console.log(error.constant);
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  imagemPerfil() {
    if(this.lastImage) {
      return this.pathForImage(this.lastImage);
    } else {
      return 'assets/images/default-avatar.png';
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PerfilPage');
    this.load();
  }

}
