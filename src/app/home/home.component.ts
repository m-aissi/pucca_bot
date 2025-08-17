import { Component, AfterViewInit, ViewChild } from '@angular/core';
import TypeIt from "typeit";
declare var particlesJS: any;
declare var bootstrap: any;
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs';
import { PuccaInput } from '../class/pucca-input.model';
import { MatDialog } from '@angular/material/dialog';
import { PatchNoteModalComponent } from '../patch-note-modal/patch-note-modal.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: false,
  styleUrl: './home.component.css'
})
export class HomeComponent {
  nameInput: string = '';
  nameTouched: boolean = false;
  showNextStep = false;
  
  // Propriétés pour la sélection de dates
  selectedDate: string = '';
  datesSelected: string[] = [];
  dateTouched: boolean = false;
  today: string = new Date().toISOString().split('T')[0];
  
  // Propriétés pour le mini calendrier
  currentDate: Date = new Date();
  calendarDays: any[] = [];
  currentMonthYear: string = '';
  
  // Propriétés pour la sélection de nourriture
  foodOptions = [
    { value: 'maki', label: '🍣 Maki' },
    { value: 'onigiri', label: '🍙 Onigiri' },
    { value: 'poke', label: '🍚 Poke' },
    { value: 'bento', label: '🍱 Bento' },
    { value: 'other', label: '✨ Autre chose' }
  ];
  selectedFood: string = '';
  otherFoodInput: string = '';
  foodTouched: boolean = false;
  otherFoodTouched: boolean = false;
  
  // Propriétés pour la sélection de lieu
  locationOptions = [
    { value: 'boisdevincennes', label: '🪵 Bois De vincennes', disabled: false },
    { value: 'parcmoonceau', label: '🌿 Parc Monceau', disabled: false },
    { value: 'jardinluxembourg', label: '🌳 Jardin du Luxembourg', disabled: false },
    { value: 'heart', label: '💖 Dans ton coeur <3', disabled: false },
    { value: 'other', label: '✨ Autre endroit', disabled: false }
  ];
  selectedLocation: string = '';
  otherLocationInput: string = '';
  locationTouched: boolean = false;
  otherLocationTouched: boolean = false;
  showHeartError: boolean = false;

  constructor(
    private http: HttpClient, 
    private dialog: MatDialog
  ) {}

  @ViewChild(PatchNoteModalComponent) patchNoteModal!: PatchNoteModalComponent;

  puccaToDisplay : any;
  currentTyping : any;
  // currentTime = new Date().toLocaleTimeString();
  firstHourRegistered : any;
  step1Validated = false;
  step2Validated = false;
  step3Validated = false;
  step4Validated = false;
  
  // Objet pour stocker toutes les réponses
  allResponses: any = {};
  
  // Propriété pour tracker si "dans ton coeur" a été cliqué
  heartClicked: boolean = false;
  
  // Propriété pour détecter qui vient de quel lien
  visitorFrom: string = '';
  
  // Propriété pour stocker l'heure de première connexion
  firstConnectionTime: Date = new Date();
  
  // Propriété pour l'orbe de lumière
  showLightOrb: boolean = false;
  
  ngOnInit() {
    this.currentTyping = new TypeIt("#element",{
      speed: 45,
      breakLines:false,
      strings:[
        "Alone in the dark.",
        "Lost... and never to be found.",
        "Surrounded by the fog.",
        "The mist thickens as light is fading out.",
        "Will I ever be able to find a way out?",
        "An escape from my own thoughts...",
        "I know how...",
        "When you're in my thoughts, there's a sparkle, a single light."
      ],
      afterComplete: () => {
        // Afficher l'orbe de lumière après la fin de l'animation
        setTimeout(() => {
          this.showLightOrb = true;
        }, 1000);
      }
    })
    .go();
  }

  onLightOrbClick() {
    // Masquer l'orbe
    this.showLightOrb = false;
    
    // Détruire l'animation TypeIt actuelle
    if (this.currentTyping) {
      this.currentTyping.destroy();
    }
    
    // Vider le conteneur
    const element = document.getElementById('element');
    if (element) {
      element.innerHTML = '';
    }
    this.initParticleJs();
    this.currentTyping = new TypeIt("#element",{
      speed: 45,
      breakLines:false,
      strings:[
        "Life with you is less gloomy.",
        "A single light can goes a long way.",
        "Thank you for being by my side.",
        "Thank you for being you.",
        "I love you <3"
      ],
    })
    .go();
    // Attendre un peu puis redémarrer l'animation

  }

  // getPuccaInputsByHeure(heure: number) {
  //   this.http.get<any[]>(`http://176.186.145.154:3000/api/puccaInputs/heure/${heure}`)
  //     .subscribe({
  //       next: (inputs) => {
  //         console.log(`PuccaInputs pour l'heure ${heure}:`, inputs)
  //         const first = inputs[0];

  //         this.puccaToDisplay = new PuccaInput(
  //           first.sentences,
  //           first.color,
  //           first.backgroundColor,
  //           first.heures,
  //           first.fontColor
  //         );

  //         this.currentTyping = new TypeIt("#element",{
  //           speed: 45,
  //           breakLines:false,
  //           strings:this.puccaToDisplay.sentences
  //         })
  //         .go();
          
  //         console.log(this.puccaToDisplay)
  //         this.initParticleJs(this.puccaToDisplay.color);
  //         // Change la couleur de fond du main-container
  //         const mainContainer = document.getElementById('main-container');
  //         if (mainContainer) {
  //           mainContainer.style.backgroundColor = this.puccaToDisplay.backgroundColor;
  //           mainContainer.style.color = this.puccaToDisplay.fontColor;
  //         }

          
  //       },
  //       error: (err) => console.error('Erreur lors du GET filtré', err)
  //     });


  // }

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

  // initClock(){
  //   setInterval(() => {
  //     this.currentTime = new Date().toLocaleTimeString();
  //     const currentHour = this.currentTime.split(":",1)
  //     if (this.firstHourRegistered == undefined){
  //       this.firstHourRegistered = currentHour;
  //       this.getPuccaInputsByHeure(Number(currentHour));
  //     }

  //     if (Number(this.firstHourRegistered) !== Number(currentHour)){
  //       console.log("changement d'heure")
  //       this.currentTyping.destroy();
  //       this.firstHourRegistered = currentHour;
  //       this.getPuccaInputsByHeure(Number(currentHour));
  //     }
  
  //   }, 1000);
  // } 


  // logConnexion() {
  //   const userAgent = navigator.userAgent;
  //   let device = 'Unknown';
  //   if (/iphone/i.test(userAgent)) device = 'iPhone';
  //   else if (/android/i.test(userAgent)) device = 'Android';
  //   else if (/windows/i.test(userAgent)) device = 'Windows PC';
  //   else if (/macintosh|mac os x/i.test(userAgent)) device = 'Mac';
  //   else if (/linux/i.test(userAgent)) device = 'Linux';
    
  //   // Enregistrer l'heure de première connexion
  //   this.firstConnectionTime = new Date();
    
  //   // Log de connexion standard
  //   this.http.post('http://176.186.145.154:3000/api/login', {
  //     userAgent,
  //     device,
  //     firstConnectionTime: this.firstConnectionTime.toISOString()
  //   }).subscribe({
  //     next: (res) => console.log('Connexion loggée', res),
  //     error: (err) => console.error('Erreur lors du log de connexion', err)
  //   });
    
  //   // Log de première connexion avec IP et modèle d'iPhone
  //   this.http.post('http://176.186.145.154:3000/api/firstConnection', {
  //     firstConnectionTime: this.firstConnectionTime.toISOString()
  //   })
  //     .subscribe({
  //       next: (res) => console.log('Première connexion loggée', res),
  //       error: (err) => console.error('Erreur lors du log de première connexion', err)
  //     });
  // }

  // openModal() {
  //   this.patchNoteModal.openModal();
  // }

  // nextFromName() {
  //   if(this.nameInput){
  //    if(this.nameInput.length > 0)
  //     this.step1Validated = true;
  //     // Collecter la réponse du nom
  //     this.allResponses.name = this.nameInput;
  //   }

  //   console.log(this.step1Validated)
  // }

  // // Méthodes pour la gestion des dates
  // onDateChange() {
  //   if (this.selectedDate && !this.datesSelected.includes(this.selectedDate)) {
  //     this.datesSelected.push(this.selectedDate);
  //     this.dateTouched = true;
  //   }
  //   // Réinitialiser l'input pour permettre une nouvelle sélection
  //   setTimeout(() => {
  //     this.selectedDate = '';
  //   }, 100);
  // }

  // removeDate(dateToRemove: string) {
  //   const index = this.datesSelected.indexOf(dateToRemove);
  //   if (index > -1) {
  //     this.datesSelected.splice(index, 1);
  //   }
  // }

  // formatDate(dateString: string): string {
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString('fr-FR', {
  //     weekday: 'long',
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric'
  //   });
  // }

  // getSortedDates(): string[] {
  //   return [...this.datesSelected].sort();
  // }

  // nextFromDates() {
  //   if (this.datesSelected.length > 0) {
  //     this.step2Validated = true;
  //     // Collecter les dates sélectionnées
  //     this.allResponses.dates = [...this.datesSelected];
  //     console.log('Dates sélectionnées:', this.datesSelected);
  //   }
  // }

  // // Méthodes pour le mini calendrier
  // initCalendar() {
  //   this.updateCalendar();
  // }

  // updateCalendar() {
  //   this.currentMonthYear = this.currentDate.toLocaleDateString('fr-FR', {
  //     month: 'long',
  //     year: 'numeric'
  //   });
  //   this.generateCalendarDays();
  // }

  // generateCalendarDays() {
  //   const year = this.currentDate.getFullYear();
  //   const month = this.currentDate.getMonth();
    
  //   const firstDay = new Date(year, month, 1);
  //   const lastDay = new Date(year, month + 1, 0);
    
  //   const startDate = new Date(firstDay);
  //   startDate.setDate(startDate.getDate() - firstDay.getDay() + (firstDay.getDay() === 0 ? -6 : 1));
    
  //   this.calendarDays = [];
    
  //   for (let i = 0; i < 42; i++) {
  //     const currentDate = new Date(startDate);
  //     currentDate.setDate(startDate.getDate() + i);
      
  //     this.calendarDays.push({
  //       date: currentDate.toISOString().split('T')[0],
  //       dayNumber: currentDate.getDate(),
  //       isCurrentMonth: currentDate.getMonth() === month
  //     });
  //   }
  // }

  // previousMonth() {
  //   this.currentDate.setMonth(this.currentDate.getMonth() - 1);
  //   this.updateCalendar();
  // }

  // nextMonth() {
  //   this.currentDate.setMonth(this.currentDate.getMonth() + 1);
  //   this.updateCalendar();
  // }

  // isDateSelected(date: string): boolean {
  //   return this.datesSelected.includes(date);
  // }

  // isToday(date: string): boolean {
  //   return date === this.today;
  // }

  // isPastDate(date: string): boolean {
  //   return date < this.today;
  // }

  // isAfter25th(date: string): boolean {
  //   const dateObj = new Date(date);
  //   return dateObj.getDate() >= 24;
  // }

  // selectDateFromCalendar(day: any) {
  //   if (day.isCurrentMonth && !this.isPastDate(day.date) && !this.isAfter25th(day.date)) {
  //     if (this.isDateSelected(day.date)) {
  //       this.removeDate(day.date);
  //     } else {
  //       this.datesSelected.push(day.date);
  //       this.dateTouched = true;
  //     }
  //   }
  // }

  // // Méthodes pour la sélection de nourriture
  // onFoodChange() {
  //   this.foodTouched = true;
  //   if (this.selectedFood !== 'other') {
  //     this.otherFoodInput = '';
  //     this.otherFoodTouched = false;
  //   }
  // }

  // isFoodValid(): boolean {
  //   if (!this.selectedFood) return false;
  //   if (this.selectedFood === 'other') {
  //     return this.otherFoodInput.trim() !== '';
  //   }
  //   return true;
  // }

  // nextFromFood() {
  //   if (this.isFoodValid()) {
  //     this.step3Validated = true;
  //     const finalFoodChoice = this.selectedFood === 'other' ? this.otherFoodInput : this.selectedFood;
  //     // Collecter le choix alimentaire
  //     this.allResponses.food = finalFoodChoice;
  //     console.log('Choix alimentaire:', finalFoodChoice);
  //   }
  // }

  // // Méthodes pour la sélection de lieu
  // onLocationChange() {
  //   this.locationTouched = true;
    
  //   if (this.selectedLocation === 'heart') {
  //     this.showHeartError = true;
  //     this.selectedLocation = '';
  //     this.heartClicked = true; // Enregistrer que "dans ton coeur" a été cliqué
      
  //     // Désactiver l'option "dans ton coeur"
  //     const heartOption = this.locationOptions.find(option => option.value === 'heart');

      
  //     // Masquer l'erreur après 3 secondes
  //     setTimeout(() => {
  //       this.showHeartError = false;
  //     }, 3000);
      
  //     return;
  //   }
    
  //   this.showHeartError = false;
    
  //   if (this.selectedLocation !== 'other') {
  //     this.otherLocationInput = '';
  //     this.otherLocationTouched = false;
  //   }
  // }

  // isLocationValid(): boolean {
  //   if (!this.selectedLocation) return false;
  //   if (this.selectedLocation === 'other') {
  //     return this.otherLocationInput.trim() !== '';
  //   }
  //   return true;
  // }

  // nextFromLocation() {
  //   if (this.isLocationValid()) {
  //     this.step4Validated = true;
  //     const finalLocationChoice = this.selectedLocation === 'other' ? this.otherLocationInput : this.selectedLocation;
  //     // Collecter le choix de lieu
  //     this.allResponses.location = finalLocationChoice;
  //     console.log('Choix de lieu:', finalLocationChoice);
      
  //     // Afficher toutes les réponses collectées
  //     this.displayAllResponses();
  //   }
  // }

  // // Méthode pour afficher toutes les réponses collectées
  // displayAllResponses() {
  //   console.log('=== TOUTES LES RÉPONSES ===');
    
  //   // Ajouter l'information sur le clic "dans ton coeur"
  //   this.allResponses.heartClicked = this.heartClicked;
    
  //   // Ajouter les heures importantes
  //   this.allResponses.firstConnectionTime = this.firstConnectionTime.toISOString();
  //   this.allResponses.finalSubmissionTime = new Date().toISOString();
    
  //   // Calculer le temps total passé sur le site
  //   const timeSpent = new Date().getTime() - this.firstConnectionTime.getTime();
  //   this.allResponses.timeSpentMinutes = Math.round(timeSpent / (1000 * 60));
    
  //   console.log(this.allResponses);
    
  //   // Ajouter la date et l'heure de soumission
  //   this.allResponses.submittedAt = new Date().toISOString();
    
  //   // Optionnel : Envoyer les données au serveur
  //   this.sendResponsesToServer();
  // }

  // // Méthode pour envoyer les réponses au serveur
  // sendResponsesToServer() {
  //   this.http.post('http://176.186.145.154:3000/api/responses', this.allResponses)
  //     .subscribe({
  //       next: (res) => console.log('Réponses envoyées avec succès', res),
  //       error: (err) => console.error('Erreur lors de l\'envoi des réponses', err)
  //     });
  // }
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
