export class Atomo{
    desc : String;
    estado : boolean;
    obj : boolean;
    padecimiento: number;
    sintoma: number
    constructor(descripcion:String,estado:boolean,obj:boolean,padecimiento:number, sintoma:number){
        this.desc = descripcion;
        this.estado=estado;
        this.obj=obj;
        this.padecimiento=padecimiento;
        this.sintoma=sintoma;
    }
}