import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-apply-project-dialog',
  templateUrl: './apply-project-dialog.component.html',
  styleUrls: ['./apply-project-dialog.component.scss']
})
export class ApplyProjectDialogComponent {
  creneaux: any = null;
  selectedCreneaux: Array<any> = [];

  constructor(
    private route: Router
  ) { }

  ngOnInit() {
    this.creneaux = [
      {
        "id": "1",
        "day": "Lundi",
        "date": "16/03/2024",
        "hour": "10h30mn"
      },
      {
        "id": "2",
        "day": "Mardi",
        "date": "17/03/2024",
        "hour": "09h00mn"
      },
      {
        "id": "3",
        "day": "Mercredi",
        "date": "86/03/2024",
        "hour": "10h30mn"
      },
      {
        "id": "4",
        "day": "Mercredi",
        "date": "86/03/2024",
        "hour": "10h30mn"
      },
    ]
  }

  onSelected(value: any) {
    this.addOrRemoveElement(value.id);
    console.log(this.selectedCreneaux);
  }

  addOrRemoveElement(element: any): void {
    const index = this.selectedCreneaux.indexOf(element);
    if (index === -1) {
        this.selectedCreneaux.push(element);
        return;
    } else {
        // this.selectedCreneaux.splice(index, 1);
        this.selectedCreneaux = this.selectedCreneaux.filter(item => item !== this.selectedCreneaux[index]);
    }
}

  // submit(value: any) {
  //   const formValue = Object.assign({}, value, {
  //     creneaux: value.creneau.map((selected: any, i: string | number) => {
        
  //     })
  //   });
  // }
  
  // get f() { return this.creneauxForm.controls; }

  //   onSubmit(value: any) {
  //       if (this.creneauxForm.invalid) {
  //           return;
  //       }
  //       alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.creneauxForm.value, null, 4));
  //       console.log(this.creneauxForm);
  //       console.log(value);
  //   }

  //   onCheckChange(event) {
  //     const formArray: FormArray = this.creneauxForm.get('creneaux') as FormArray;
    
  //     /* Selected */
  //     if(event.target.checked){
  //       // Add a new control in the arrayForm
  //       formArray.push(new FormControl(event.target.value));
  //     }
  //     /* unselected */
  //     else{
  //       // find the unselected element
  //       let i: number = 0;
    
  //       formArray.controls.forEach((ctrl: FormControl) => {
  //         if(ctrl.value == event.target.value) {
  //           // Remove the unselected element from the arrayForm
  //           formArray.removeAt(i);
  //           return;
  //         }
    
  //         i++;
  //       });
  //     }
  //   }
    
  backStep() {
    this.route.navigate(['opportunities'])
  }
}
