import { AbstractControl } from "@angular/forms";
import * as moment from 'moment';
export class DateValidator {
    static isFutureDate(control : AbstractControl){
        let todayDate = moment().format();
        let controlDate = moment(control.value).format();
        if(controlDate < todayDate && controlDate != todayDate){
            return null;
        }else{
            return{'isFutureDate': true}
        }
    }

    static noValidAge(control: AbstractControl){
        let today = moment();
        let todayDate = moment().format('L');
        let controlDate = moment(control.value).format('L');
        let years = today.diff(control.value, 'years');
        if(years > 16 || controlDate > todayDate){
            return null
        }else{
            return{'noValidAge': true}  
        }
        
    }
}