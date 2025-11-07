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
    // Convertir heures de string à array si nécessaire
    if (typeof input.heures === 'string') {
      input.heures = input.heures.split(',').map((h: string) => parseInt(h.trim(), 10));
    }
    
    console.log('Mise à jour de l\'input', input);
    
    // Créer une copie sans les champs MongoDB internes
    const cleanInput = {
      sentences: input.sentences,
      backgroundColor: input.backgroundColor,
      fontColor: input.fontColor,
      heures: input.heures
    };
    
    this.http.put(`http://176.186.145.154:3000/api/puccaInputs/${input._id}`, cleanInput)
      .subscribe({
        next: (res) => {
          console.log('✅ Input mise à jour avec succès', res);
        },
        error: (err) => {
          console.error('❌ Erreur lors de la mise à jour', err);
        }
      });
  }

  createPucca() {

    console.log('Nouveau pucca créé', this.newPucca);
    this.puccaInputs.push({...this.newPucca});

    //   app.post('/api/puccaInputs/new', async (req, res) => {
    // try {
    //   const newInput = req.body;
    //   newInput._id = uuidv4(); // Génère un ID unique
    //   await mongoose.connection.db.collection('puccaInputs').insertOne(newInput);
    //   res.status(201).json(newInput);
    // } catch (error) {
    //   res.status(500).json({ message: error.message });
    // }
    // });
    this.http.post(`http://176.186.145.154:3000/api/puccaInputs/new`, this.newPucca)
      .subscribe({
        next: (res) => {
          console.log('✅ Nouveau pucca créé avec succès', res);
        },
        error: (err) => {
          console.error('❌ Erreur lors de la création du pucca', err);
        }
      });

    this.newPucca = { backgroundColor: '#000000', fontColor: 'white', heures: [], sentences: [''] };

  }
  
  trackByFn(index: number, item: any): number {
    return index;
  }

  deleteInput(input: any) {
      console.log('Suppression de l\'input', input);
      this.http.delete(`http://176.186.145.154:3000/api/puccaInputs/${input._id}`)
        .subscribe({
          next: (res) => {
            console.log('✅ Input supprimé avec succès', res);
            // Retirer l'input supprimé de la liste locale
            this.puccaInputs = this.puccaInputs.filter(i => i._id !== input._id);
          },
          error: (err) => {
            console.error('❌ Erreur lors de la suppression', err);
          }
        });
  }

  trackByPuccaId(index: number, item: any): any {
    return item.id || index;
  }

}
