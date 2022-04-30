import { Injectable } from '@angular/core';
import { forkJoin,Observable, of } from 'rxjs';
import { Assignment } from '../assignments/assignment.model';
import { LoggingService } from './logging.service';
import { HttpClient } from '@angular/common/http';
import { bdInitialAssignments } from './data';


@Injectable({
  providedIn: 'root'
})

export class AssignmentsService {
  private localProtocol = "http"
  private localPort = ":8010"
  private url = (document.domain.startsWith("localhost") ? this.localProtocol : "https")+"://"+ document.domain + (document.domain.startsWith("localhost") ? this.localPort : "")+"/api"
  //private url = "https://tpmbdsmadagascarback.herokuapp.com/api";
  
  getAssignments(page:number, limit:number):Observable<any> {
    // en réalité, bientôt au lieu de renvoyer un tableau codé en dur,
    // on va envoyer une requête à un Web Service sur le cloud, qui mettra un
    // certain temps à répondre. On va donc préparer le terrain en renvoyant
    // non pas directement les données, mais en renvoyant un objet "Observable"
    //return of(this.assignments);
    return this.http.get<Assignment[]>(this.url + "/assignments?page=" + page + "&limit=" + limit);
  }


  constructor(private loggingService:LoggingService, private http: HttpClient) {
    this.loggingService.setNiveauTrace(2);

  }
  
  public getAssignmentsComplete() {
    return this.http.get(this.url + "/assignmentsComplete");
  }

  public postAssignment(assignment: Assignment) {
    const headers = {'content-type':'application/json'}
    const body = JSON.stringify(assignment)
    return this.http.post(this.url + '/assignmentsEachStudent', body, {'headers':headers})
  }

  public noterAssignment(assignment: Assignment) {
    const headers = {'content-type':'application/json'}
    const body = JSON.stringify(assignment)
    return this.http.put(this.url + '/noteAssignment', body, {'headers':headers})
  }

  public editAssignment(assignment: Assignment) {
    const headers = {'content-type':'application/json'}
    const body = JSON.stringify(assignment)
    return this.http.put(this.url + '/editAssignment', body, {'headers':headers})
  }

  public deleteAssignment(idAssignment: string) {
    return this.http.delete(this.url + '/deleteAssignment/'+idAssignment)
  }
  addAssignment(assignment:Assignment):Observable<any> {
    // this.assignments.push(assignment);
 
     this.loggingService.log(assignment.titre, "ajouté");
 
     return this.http.post<Assignment>(this.url+ '/', assignment);
 
     //return of("Assignment ajouté");
   }
   peuplerBD() {
    bdInitialAssignments.forEach(a => {
      //let newAssignment = new Assignment();
      const newAssignment:any = new Assignment();
      newAssignment.eleveRef = a.eleveRef;
      newAssignment.matiereRef = a.matiereRef;
      newAssignment.titre = a.titre;
      newAssignment.remarques = a.remarques;
      newAssignment.note = a.note;
      newAssignment.dateDeRendu = new Date(a.dateDeRendu);
      newAssignment.rendu = a.rendu;
      this.addAssignment(newAssignment)
      .subscribe(reponse => {
        console.log(reponse.message);
      })
    })
  }
  peuplerBDAvecForkJoin(): Observable<any> {
    const appelsVersAddAssignment:any = [];

    bdInitialAssignments.forEach((a) => {
      const nouvelAssignment:any = new Assignment();

      nouvelAssignment.eleveRef = a.eleveRef;
      nouvelAssignment.matiereRef = a.matiereRef;
      nouvelAssignment.titre = a.titre;
      nouvelAssignment.remarques = a.remarques;
      nouvelAssignment.note = a.note;
      nouvelAssignment.dateDeRendu = new Date(a.dateDeRendu);
      nouvelAssignment.rendu = a.rendu;

      appelsVersAddAssignment.push(this.addAssignment(nouvelAssignment));
    });
    return forkJoin(appelsVersAddAssignment); // renvoie un seul Observable pour dire que c'est fini
  }

  /*getAssignments():Observable<Assignment[]> {
    // en réalité, bientôt au lieu de renvoyer un tableau codé en dur,
    // on va envoyer une requête à un Web Service sur le cloud, qui mettra un
    // certain temps à répondre. On va donc préparer le terrain en renvoyant
    // non pas directement les données, mais en renvoyant un objet "Observable"
    return of(this.assignments);
  }

  getAssignment(id:number):Observable<Assignment|undefined> {
    let a = this.assignments.find(a => a.id === id);
    return of(a);
  }

  addAssignment(assignment:Assignment):Observable<string> {
    this.assignments.push(assignment);

    this.loggingService.log(assignment.nom, "ajouté");

    return of("Assignment ajouté");
  }

  updateAssignment(assignment:Assignment):Observable<string> {
    this.loggingService.log(assignment.nom, "modifié");

    return of("Assignment modifié");
  }

  deleteAssignment(assignment:Assignment):Observable<string> {
    let pos = this.assignments.indexOf(assignment);
    this.assignments.splice(pos, 1);

    this.loggingService.log(assignment.nom, "supprimé");

    return of("Assignment supprimé");
  }*/
}
