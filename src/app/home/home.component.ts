import { Component, AfterViewInit, ViewChild } from '@angular/core';
import TypeIt from "typeit";
declare var particlesJS: any;
declare var bootstrap: any;
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs';
import { PuccaInput } from '../class/pucca-input.model';
import { MatDialog } from '@angular/material/dialog';
import { PatchNoteModalComponent } from '../patch-note-modal/patch-note-modal.component';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { ProfileModalComponent } from '../profile-modal/profile-modal.component';
import { AuthService, User } from '../services/auth.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: false,
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {
  currentUser: User | null = null;

  constructor(private http: HttpClient, private dialog: MatDialog, private auth: AuthService) {}

  @ViewChild(PatchNoteModalComponent) patchNoteModal!: PatchNoteModalComponent;
  @ViewChild(LoginModalComponent) loginModal!: LoginModalComponent;
  @ViewChild(ProfileModalComponent) profileModal!: ProfileModalComponent;

  puccaToDisplay : any;
  currentTyping : any;
  currentTime = new Date().toLocaleTimeString();
  firstHourRegistered : any;

  ngOnInit() {
    // laisser les initialisations qui n'ont pas besoin des ViewChild
    this.logConnexion();
    this.initClock();
  }

  ngAfterViewInit() {
    // ViewChild disponibles ici
    this.auth.user$.subscribe(u => {
      this.currentUser = u;
      console.log('user connected', u);

      if (u) {
        // fermer la modal de login si elle est ouverte (sécurité)
        try { this.loginModal?.closeModal(); } catch (e) {}

        // ouvrir la modal profile si disponible
        if (this.profileModal && typeof this.profileModal.openModal === 'function') {
          try { this.profileModal.openModal(); } catch (e) { console.error(e); }
        } else {
          // fallback : ouvrir via bootstrap en ciblant l'ID du modal profile
          const el = document.getElementById('profileModal');
          if (el) {
            try {
              const modal = new (window as any).bootstrap.Modal(el);
              modal.show();
            } catch (e) { console.error(e); }
          }
        }
      }
    });
  }

  getPuccaInputsByHeure(heure: number, minute?: number) {
    this.http.get<any[]>(`http://176.186.145.154:3000/api/puccaInputs/heure/${heure}`)
      .subscribe({
        next: (inputs) => {
          console.log(`PuccaInputs pour l'heure ${heure}:`, inputs)

          if (minute !== undefined) {
             for (let input of inputs) {
              for (let h of input.heures) {
                if (h % 1 !== 0) {
                  var stringH = h.toString();
                  const decimalPart = parseInt(stringH.split(".")[1]);
                  console.log("decimalPart :", decimalPart);

                  if (minute === decimalPart) {
                    console.log("float input trouvé dans la boucle :", input);
                    var floatInput = input;
                    break;
                  }
                }
              }
              }

            if (floatInput) {
              console.log("float input trouvé :", floatInput);
              this.puccaToDisplay = new PuccaInput(
                floatInput.sentences,
                floatInput.color,
                floatInput.backgroundColor,
                floatInput.heures,
                floatInput.fontColor
              );
              this.currentTyping = new TypeIt("#element",{
                speed: 45,
                breakLines:false,
                strings:this.puccaToDisplay.sentences
              })
              .go();
            } else {
              var first = inputs[0];
              this.puccaToDisplay = new PuccaInput(
                first.sentences,
                first.color,
                first.backgroundColor,
                first.heures,
                first.fontColor
              );
              this.currentTyping = new TypeIt("#element",{
                speed: 45,
                breakLines:false,
                strings:this.puccaToDisplay.sentences
              })
              .go();
            }
          }
          console.log(this.puccaToDisplay)
          this.initParticleJs(this.puccaToDisplay.color);
          const mainContainer = document.getElementById('main-container');
          if (mainContainer) {
            mainContainer.style.backgroundColor = this.puccaToDisplay.backgroundColor;
            mainContainer.style.color = this.puccaToDisplay.fontColor;
            if(floatInput) {
              const puccaImage = document.getElementById('puccaImage') as HTMLImageElement;
              if (puccaImage) {
                puccaImage.src = "img/pucca2.png";
              }
            }
          }
        },
        error: (err) => console.error('Erreur lors du GET filtré', err)
      });


  }

  initParticleJs(color?: string){
    // Charger la config JSON
    fetch('assets/particles.json')
      .then(res => res.json())
      .then(config => {
        if (color) {
          config.particles.color.value = color;
        }
        particlesJS('particles-js', config);
      });
  }

  initClock(){
    setInterval(() => {
      this.currentTime = new Date().toLocaleTimeString();
      const currentHour = this.currentTime.split(":",1)
      if (this.firstHourRegistered == undefined){
        this.firstHourRegistered = currentHour;
        this.getPuccaInputsByHeure(Number(currentHour), Number(this.currentTime.split(":",2)[1]));
      }

      if (Number(this.firstHourRegistered) !== Number(currentHour)){
        console.log("changement d'heure")
        this.currentTyping.destroy();
        this.firstHourRegistered = currentHour;
        this.getPuccaInputsByHeure(Number(currentHour), Number(this.currentTime.split(":",2)[1]));
      }
  
    }, 1000);
  } 


  logConnexion() {
    const userAgent = navigator.userAgent;
    let device = 'Unknown';
    if (/iphone/i.test(userAgent)) device = 'iPhone';
    else if (/android/i.test(userAgent)) device = 'Android';
    else if (/windows/i.test(userAgent)) device = 'Windows PC';
    else if (/macintosh|mac os x/i.test(userAgent)) device = 'Mac';
    else if (/linux/i.test(userAgent)) device = 'Linux';
    this.http.post('http://176.186.145.154:3000/api/login', {
      userAgent,
      device
    }).subscribe({
      next: (res) => console.log('Connexion loggée', res),
      error: (err) => console.error('Erreur lors du log de connexion', err)
    });
  }

  openModal() {
    this.patchNoteModal.openModal();
  }

  openModalLogin() {
    
    this.loginModal.openModal();
  }

  openModalProfile() {
    this.profileModal.openModal();
  }
}
