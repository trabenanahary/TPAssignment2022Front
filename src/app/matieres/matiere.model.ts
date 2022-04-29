import { User } from "../users/user.modele";

export class Matiere {
    _id!:string;
    nom!:string;
    picture!:string;
    prof!:User;
    eleve!:Array<User>;
}
  