import {Atomo} from './atomo.class';
export class Calculus{

     calculateCloseness(conocimientoEvaluado,baseConocimiento,memoriaDeTrabajo){
        let atomsInRule;
        let commonAtoms;
        let bestPorcentage = 0;
        let percentage;
        let sintomasExtras = [];
        conocimientoEvaluado.forEach(element => {
          if(element[0].partesConclusion[0].obj==true){
         atomsInRule=0;
         commonAtoms=0;
         element[0].partesCondicion.forEach(parte =>{
           if(parte instanceof Atomo){
             atomsInRule++;
           }
           if(memoriaDeTrabajo.atomosAfirmados.some(atom => atom.desc === parte.desc)){
             commonAtoms++;
           }
         });
         percentage = commonAtoms * 100 / atomsInRule;
         if(percentage > 10 && percentage != 100){
           let showPercentage = percentage*0.01;
           let closeness = {padecimiento: element[0].partesConclusion[0].desc, porcentaje: Math.floor(percentage), showPorcentaje: showPercentage.toFixed(1)};
           sintomasExtras.push(closeness);
         }
       }
       });
       baseConocimiento.forEach(element => {
         if(element.partesConclusion[0].obj==true){
         atomsInRule=0;
         commonAtoms=0;
         element.partesCondicion.forEach(parte =>{
           if(parte instanceof Atomo){
             atomsInRule++;
           }
           if(memoriaDeTrabajo.atomosAfirmados.some(atom => atom.desc === parte.desc)){
             commonAtoms++;
           }
         });
         percentage = commonAtoms * 100 / atomsInRule;
         if(percentage > 10 && percentage != 100){
           let showPercentage = percentage*0.01;
           let closeness = {padecimiento: element.partesConclusion[0].desc, porcentaje: Math.floor(percentage), showPorcentaje: showPercentage.toFixed(1)};
          console.log(closeness);
           sintomasExtras.push(closeness);
         }
       }
       });
  
        return sintomasExtras;
      }
}