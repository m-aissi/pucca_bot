import { Component, AfterViewInit } from '@angular/core';
import TypeIt from "typeit";
declare var particlesJS: any;
declare var bootstrap: any;
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs';
import { PuccaInput } from './class/pucca-input.model';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private http: HttpClient, private dialog: MatDialog) {}

  puccaToDisplay : any;

  currentTime = new Date().toLocaleTimeString();
  firstHourRegistered : any;

  ngOnInit() {
    this.logConnexion();
    this.initClock();
  }

  getPuccaInputsByHeure(heure: number) {
    this.http.get<any[]>(`http://176.186.145.154:3000/api/puccaInputs/heure/${heure}`)
      .subscribe({
        next: (inputs) => {
          console.log(`PuccaInputs pour l'heure ${heure}:`, inputs)
          const first = inputs[0];

          this.puccaToDisplay = new PuccaInput(
            first.sentences,
            first.color,
            first.backgroundColor,
            first.heures,
            first.fontColor
          );

          new TypeIt("#element",{
            speed: 55,
            breakLines:false,
            strings:this.puccaToDisplay.sentences
          })
          .go();
          
          console.log(this.puccaToDisplay)
          this.initParticleJs(this.puccaToDisplay.color);
          // Change la couleur de fond du main-container
          const mainContainer = document.getElementById('main-container');
          if (mainContainer) {
            mainContainer.style.backgroundColor = this.puccaToDisplay.backgroundColor;
            mainContainer.style.color = this.puccaToDisplay.fontColor;
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
        this.getPuccaInputsByHeure(Number(currentHour));
      }

      if (Number(this.firstHourRegistered) !== Number(currentHour)){
        console.log("changement d'heure")
        this.firstHourRegistered = currentHour;
        this.getPuccaInputsByHeure(Number(currentHour));
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
    const modal = new bootstrap.Modal(document.getElementById('puccaModal'));
    modal.show();
  }

// const puccaInput = {
//   sentences: ["Coucou !", "Il est l'heure de coder.", "Bonne chance !"],
//   color: "#ff69b4",
//   heures: [8, 12]
// };

// this.http.post('http://192.168.1.90:3000/api/puccaInputs', puccaInput)
//   .subscribe({
//     next: (res) => console.log('Ajout réussi', res),
//     error: (err) => console.error('Erreur lors de l\'ajout', err)
// });
// rainbowtext
  // new TypeIt("#callback", {
  //   strings: ["Look, it's rainbow text!"],
  //   afterStep: function (instance) {
  //     instance.getElement().style.color = getRandomColor();
  //   },
  // }).go();
}
