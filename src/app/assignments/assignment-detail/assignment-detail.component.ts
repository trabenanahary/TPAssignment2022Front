import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { AuthService } from 'src/app/shared/auth.service';
import { Assignment } from '../assignment.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-assignment-detail',
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.css'],
})
export class AssignmentDetailComponent implements OnInit {
  assignmentTransmis?: Assignment;
  assignments!: Assignment;
  noteClicked = false;
  editClicked = false;
  aNoterGroup: FormGroup = new FormGroup({
    // regex sur https://stackoverflow.com/questions/40917953/regex-to-accept-digits-from-0-to-20-including-1-or-2-decimal-numbers-in-c-sharp
    note: new FormControl(0, Validators.pattern(/^(?:1?\d(?:\.\d{1,2})?|20(?:\.0?0?)?)$/)),
    remarques: new FormControl('')
  });

  editAssignmentGroup: FormGroup = new FormGroup({
    titre: new FormControl(this.data.titre),
    dtRendu: new FormControl(this.data.dateDeRendu),
  })
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Assignment,
    private assignmentsService: AssignmentsService,
    private authService:AuthService,
    private route: ActivatedRoute,
    private router: Router,
    public dialogRef: MatDialogRef <AssignmentDetailComponent>
  ) {}

  ngOnInit(): void {
    // on va récupérer l'id dans l'URL,
    // le + permet de forcer en number (au lieu de string)
    /*const id = +this.route.snapshot.params['id'];
    this.getAssignment(id);*/
  }

  /*getAssignment(id: number) {
    // on demande au service de gestion des assignment,
    // l'assignment qui a cet id !
    this.assignmentsService.getAssignment(id).subscribe((assignment) => {
      this.assignmentTransmis = assignment;
    });
  }*/

  noter(idAssignment:any) {
    this.assignments = new Assignment();
    this.assignments._id = idAssignment;
    this.assignments.note = this.aNoterGroup.value.note
    this.assignments.remarques = this.aNoterGroup.value.remarques
    console.log(this.assignments)
    this.assignmentsService.noterAssignment(this.assignments).subscribe((res:any) => {
      this.dialogRef.close();
    })
  }

  editAssignment(idAssignment: any){
    this.assignments = new Assignment();
    this.assignments._id = idAssignment;
    this.assignments.titre = this.editAssignmentGroup.value.titre
    this.assignments.dateDeRendu = this.editAssignmentGroup.value.dtRendu ? this.editAssignmentGroup.value.dtRendu : "";
    this.assignmentsService.editAssignment(this.assignments).subscribe((res:any) => {
      this.dialogRef.close();
    })
  }

  onClickEdit() {
    this.editClicked = !this.editClicked
    this.noteClicked = false;
    /*this.router.navigate(['/assignment', this.assignmentTransmis?.id, 'edit'], {
      queryParams: {
        name: 'Michel Buffa',
        job: 'Professeur',
      },
      fragment: 'edition',
    });*/
  }

  onClickNote() {
    this.noteClicked = !this.noteClicked
    this.editClicked = false;
  }

  onAssignmentRendu() {
    /*if (this.assignmentTransmis) {
      this.assignmentTransmis.rendu = true;

      this.assignmentsService
        .updateAssignment(this.assignmentTransmis)
        .subscribe((message) => {
          console.log(message);
          // et on navigue vers la page d'accueil pour afficher la liste
          this.router.navigate(['/home']);
        });
    }*/
  }

  onDelete(idAssignment: string) {
    this.assignmentsService.deleteAssignment(idAssignment).subscribe((res:any) => {
      this.dialogRef.close();
    })
    /*if (!this.assignmentTransmis) return;

    this.assignmentsService
      .deleteAssignment(this.assignmentTransmis)
      .subscribe((message) => {
        console.log(message);
        // et on navigue vers la page d'accueil pour afficher la liste
        this.router.navigate(['/home']);
      });*/
  }

  

  isLoggedIn() {
    return this.authService.loggedIn;
  }
}
