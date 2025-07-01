import { Component } from '@angular/core';
import TypeIt from "typeit";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'pucca_bot';


  currentTime = new Date().toLocaleTimeString();

  ngOnInit() {
    setInterval(() => {
      this.currentTime = new Date().toLocaleTimeString();
    }, 1000);


    new TypeIt("#element",{speed: 55})
    .type("Salut c moi Pucca Crimson Tears, enchantée")
    .delete()
    .type("Plus a little more.")
    .go();


  }
// rainbowtext
  // new TypeIt("#callback", {
  //   strings: ["Look, it's rainbow text!"],
  //   afterStep: function (instance) {
  //     instance.getElement().style.color = getRandomColor();
  //   },
  // }).go();
}
