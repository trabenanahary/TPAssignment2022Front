import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Assignment } from '../assignment.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { MatieresService } from 'src/app/shared/matieres.service';
import { Matiere } from 'src/app/matieres/matiere.model';


@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css'],
})
export class AddAssignmentComponent implements OnInit {
  matieres: Matiere[] = [];
  prof: string = "";
  error: string = "";
  assignments!: Assignment;
  firstFormGroup: FormGroup = new FormGroup({
    matiere: new FormControl('', Validators.required),
    prof: new FormControl({value:'',disabled: true})
  });
  secondFormGroup: FormGroup = new FormGroup({
    titre: new FormControl('', Validators.required),
    dtRendu: new FormControl(''),
  });
  // Champ de formulaire
  nomAssignment!: string;
  dateDeRendu!: Date;

  constructor(private assignmentsService:AssignmentsService, private matieresService:MatieresService, private router:Router) {}

  ngOnInit() {
    this.matieresService.getMatiereComplete()
    .subscribe((matiere: any) => {
      this.matieres = matiere;
    });
  }

  onSelectMatiere(matiereEvent: any) {
    this.prof = matiereEvent.value.prof.nom
  }

  valider() {
    this.assignments = new Assignment();
    this.assignments.dateDeRendu = this.secondFormGroup.value.dtRendu ? this.secondFormGroup.value.dtRendu : "";
    this.assignments.matiereRef = this.firstFormGroup.value.matiere._id;
    this.assignments.titre = this.secondFormGroup.value.titre
    this.assignmentsService.postAssignment(this.assignments).subscribe((res:any) => {
      if(res.errorEmpty) {
        this.error = res.errorEmpty
      } else {
        this.router.navigate(['/'])
      }
    })
  }

  onSubmit() {
    /*if((!this.nomAssignment) || (!this.dateDeRendu)) return;
    console.log(
      'nom = ' + this.nomAssignment + ' date de rendu = ' + this.dateDeRendu
    );

    let newAssignment = new Assignment();
    newAssignment.id = Math.round(Math.random()*10000000);
    newAssignment.nom = this.nomAssignment;
    newAssignment.dateDeRendu = this.dateDeRendu;
    newAssignment.rendu = false;

    this.assignmentsService.addAssignment(newAssignment)
    .subscribe(message => {
      console.log(message);

      // il va falloir naviguer (demander au router) d'afficher à nouveau la liste
      // en gros, demander de naviguer vers /home
      this.router.navigate(["/home"]);
    })*/
  }
}
