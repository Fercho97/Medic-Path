import {Atomo} from './atomo.class';

export class MemoriaTrabajo{
    atomosAfirmados : Array<Atomo>
    atomosNegados : Array<Atomo>

    constructor(){
        this.atomosAfirmados = [];
        this.atomosNegados = [];
    }

    almacenarAtomo(atomo : Atomo){
        if(this.atomosAfirmados.indexOf(atomo) == -1 && this.atomosNegados.indexOf(atomo) == -1){
            if(atomo.estado==true){
                this.atomosAfirmados.push(atomo);
            }
            else{
                this.atomosNegados.push(atomo);
            }
        }
    }

    estaAlmacenado(atomo : Atomo){
        let contained = false;
        for(let afirmado of this.atomosAfirmados){
            if(afirmado.desc===atomo.desc){
                contained=true;
            }
        }

        for(let negado of this.atomosNegados){
           if(negado.desc===atomo.desc){
               contained=true;
           }
        }

        return contained;
    }

    obtenerAtomo(atomo : Atomo){
        for(let afirmado of this.atomosAfirmados){
            if(afirmado.desc===atomo.desc){
                return afirmado;
            }
        }
    
        for(let negado of this.atomosNegados){
            if(negado.desc===atomo.desc){
                return negado;
            }
        }
    }
}