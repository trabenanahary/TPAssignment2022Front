import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AssignmentsService } from '../shared/assignments.service';
import { AssignmentDetailComponent } from './assignment-detail/assignment-detail.component';
import { Assignment } from './assignment.model';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css'],
})
export class AssignmentsComponent implements OnInit {
  assignments: Assignment[] = [];
  dialogAssignment!: MatDialogRef <AssignmentDetailComponent>
   // pagination
   page=1;
   limit=10;
   totalPages=0;
   pagingCounter=0;
   hasPrevPage=false;
   hasNextPage=true;
   prevPage= 1;
   nextPage= 2;
 
  constructor(private assignmentsService:AssignmentsService, private dialog: MatDialog) {}

  openDetailsDialog(assign: Assignment) {
    this.dialogAssignment = this.dialog.open(AssignmentDetailComponent, {
      data: assign
    })
    this.dialogAssignment.afterClosed().subscribe(result => {

      this.getAssignments();

    })
  }

  // appelé après le constructeur et AVANT l'affichage du composant
  ngOnInit(): void {
    console.log("Dans ngOnInit, appelé avant l'affichage");
    this.getAssignments();
  }

  getAssignments() {
      // demander les données au service de gestion des assignments...
      this.assignmentsService.getAssignments( this.page, this.limit)
      .subscribe(reponse => {
        console.log("données arrivées");
        this.assignments = reponse.docs;
        this.page = reponse.page;
        this.limit=reponse.limit;
        this.totalPages=reponse.totalPages;
        this.pagingCounter=reponse.pagingCounter;
        this.hasPrevPage=reponse.hasPrevPage;
        this.hasNextPage=reponse.hasNextPage;
        this.prevPage= reponse.prevPage;
        this.nextPage= reponse.nextPage;
     });

      console.log("Après l'appel au service");
  }
  pagePrecedente() {
    this.page--;
    this.getAssignments();
  }

  pageSuivante() {
    this.page++;
    this.getAssignments();
  }

  premierePage() {
    this.page = 1;
    this.getAssignments();
  }

  dernierePage() {
    this.page = this.totalPages;
    this.getAssignments();
  }
}
