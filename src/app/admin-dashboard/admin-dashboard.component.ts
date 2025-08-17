import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  puccaInputs: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAllPuccaInputs();
  }

  getAllPuccaInputs() {
    this.http.get<any[]>(`http://176.186.145.154:3000/api/puccaInputs/all`)
      .subscribe({
        next: (res) => {          
          this.puccaInputs = res;
        },
        error: (err) => console.error('Erreur lors du GET filtré', err)
      });
  }



  newPucca = {
    backgroundColor: '#000000',
    fontColor: 'white',
    heures: [],
    sentences: ['']
  };
  
  toggleFontColor(input: any) {
    input.fontColor = input.fontColor === 'white' ? 'black' : 'white';
  }
  
  addSentence(input: any) {
    input.sentences.push('');
  }
  
  removeSentence(input: any, index: number) {
    input.sentences.splice(index, 1);
  }
  
  validateChanges(input: any) {
    console.log('Changements validés pour', input);
    // plus tard : requête PUT vers API
  }
  
  createPucca() {
    console.log('Nouveau pucca créé', this.newPucca);
    this.puccaInputs.push({...this.newPucca});
    this.newPucca = { backgroundColor: '#000000', fontColor: 'white', heures: [], sentences: [''] };
  }
  
}
