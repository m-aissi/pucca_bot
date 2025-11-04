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
// end point pour modifier une input
// app.put('/api/puccaInputs/:id', async (req, res) => {
//   try {
//     const id = req.params.id;
//     const updatedInput = req.body;
//     await mongoose.connection.db.collection('puccaInputs').updateOne({ id: id, }, { $set: updatedInput });
//     res.json({ message: 'Input mise à jour avec succès' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
//
    //on change l'heure de format string a array de integer
    if (typeof input.heures === 'string') {
      input.heures = input.heures.split(',').map((h: string) => parseInt(h.trim(), 10));      
    }
    console.log('Mise à jour de l\'input', input);
    // this.http.put(`http://176.186.145.154:3000/api/puccaInputs/${input.id}`, input)
    //   .subscribe({
    //     next: () => {
    //       console.log('Input mise à jour avec succès');
    //     },
    //     error: (err) => console.error('Erreur lors de la mise à jour', err)
    //   });
}

  createPucca() {
    console.log('Nouveau pucca créé', this.newPucca);
    this.puccaInputs.push({...this.newPucca});
    this.newPucca = { backgroundColor: '#000000', fontColor: 'white', heures: [], sentences: [''] };
  }
  
  trackByFn(index: number, item: any): number {
    return index;
  }

  trackByPuccaId(index: number, item: any): any {
    return item.id || index;
  }

}
