
export class PilaBooleana{
    datos : Array<any>

    constructor(){
        this.datos = [];
    }

    estaVacia(){
        if(this.datos.length > 0){
            return false;
        }
        else{
            return true;
        }
    }

    push(valor : any){
        this.datos.push(valor);
    }
}