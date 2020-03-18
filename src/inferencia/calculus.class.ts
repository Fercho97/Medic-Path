import {Atomo} from './atomo.class';
import {Regla} from './regla.class';
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
         if(percentage > 70 && percentage != 100){
           let showPercentage = percentage*0.01;
           let closeness = {padecimiento: element.partesConclusion[0].desc, porcentaje: Math.floor(percentage), showPorcentaje: showPercentage.toFixed(1)};
          console.log(closeness);
           sintomasExtras.push(closeness);
         }
       }
       });
  
        return sintomasExtras;
      }

      getDifferencesBetweenNames(names : any, sint: any){
        let samewords : any = this.getSameWords(names, sint);
        let differences : any = [];
        let result = [];
        names.forEach(element => {
        let compareElement = element.split(" ");
          compareElement.forEach(word =>{
            if(samewords.indexOf(word)===-1)
              differences.push(word);
          })
        });
        
        result.push(differences);
        let text = samewords.join(' ');
        console.log(text);
        result.push(text);
        return result;
      }

      getSameWords(names : any, sint :any){
       let sameWords : any = [];
        let compareTo = sint.split(" ");
        names.forEach(element => {
          if(element!==sint){
          let compareElement = element.split(" ");
          console.log(compareElement);
            compareElement.forEach(word => {
              let index = compareTo.indexOf(word);
              if(index!=-1){
                if(sameWords.indexOf(word)==-1)
                    sameWords.push(word);
              }
            });
          }
          });
        return sameWords;
      }

      pathSelection(baseConocimiento: any, memoriaDeTrabajo: any){
        let bestStart;
        let atomsInRule;
        let commonAtoms;
        let bestPorcentage = 0;
        let porcentage;
        let index = 0;
        baseConocimiento.forEach((element:Regla)=> {
          atomsInRule=0;
          commonAtoms=0;
          index++;
          element.partesCondicion.forEach(parte =>{
            if(parte instanceof Atomo){
              atomsInRule++;
            }
            if(memoriaDeTrabajo.atomosAfirmados.some(atom => atom.desc === parte.desc)){
              commonAtoms++;
            }
          });
          porcentage = commonAtoms * 100 / atomsInRule;
          if(porcentage > bestPorcentage){
            bestPorcentage = porcentage;
            bestStart = index;
          }
        });
        if(bestStart==undefined){
        bestStart = Math.floor(Math.random() * baseConocimiento.length) + 1;
        }
        return bestStart-1;
      }
}