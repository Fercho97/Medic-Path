import { AbstractControl } from "@angular/forms";
import * as moment from 'moment';
export class DateValidator {
    static isFutureDate(control : AbstractControl){
        let todayDate = moment().format('L');
        console.log(todayDate);
        let controlDate = moment(control.value).format('L');
        console.log(controlDate);
        if(controlDate < todayDate && controlDate != todayDate){
            return null;
        }else if(controlDate > todayDate){
            return{'isFutureDate': true}
        }
    }

    static noValidAge(control: AbstractControl){
        let enteredDate = moment(control.value).fromNow();
        let todayDate = moment().format('L');
        let controlDate = moment(control.value).format('L');
        if(enteredDate == "18 years ago" || enteredDate == "17 years ago" || enteredDate == "16 years ago" || controlDate > todayDate){
            return null
        }else{
            return{'noValidAge': true}  
        }
        
    }
}