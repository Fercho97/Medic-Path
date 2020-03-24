export class ErrorMsg{
    public static ERROR_MSG_REGISTER =  {
        'nickname' : [
          {type: 'required', message: 'El campo de nickname es requerido'},
          {type: 'minlength', message: 'El nickname debe ser mayor a 3 caracteres'},
          {type: 'maxlength', message: 'El nickname debe ser menor a 20 caracteres'},
          {type: 'userTaken', message: 'Usuario en uso, intente con otro'}
        ],
        'nombres' : [
          {type: 'required', message: 'El nombre no se puede quedar vacio'},
          {type: 'minlength', message: 'La longitud debe ser mayor a 3 caracteres'},
          {type: 'maxlength', message: 'La longitud debe ser menor a 50 caracteres'}
        ],
        'apellidos' : [
          {type: 'required', message: 'Los apellidos no pueden quedar vacios'},
          {type: 'minlength', message: 'La longitud debe ser mayor a 3 caracteres'},
          {type: 'maxlength', message: 'La longitud debe ser menor a 50 caracteres'}
        ],
        'email' : [
          {type: 'required', message: 'Es necesario ingresar un correo'},
          {type: 'pattern', message: 'El texto ingresado no representa un correo'},
          {type: 'emailTaken', message: 'Correo en uso, intente con otro'}
        ],
        'fecha_nacimiento' : [
          {type: 'required', message: 'Debe seleccionar una fecha'},
          {type: 'isFutureDate', message: 'Debe elegir una fecha anterior a la actual'},
          {type: 'noValidAge', message: 'Usted no cumple con los requisitos de edad para el uso del sistema'}
        ],
        'password' : [
          {type: 'required', message: 'Debe ingresar una contraseña'},
          {type: 'minlength', message: 'La contraseña debe tener más de 5 caracteres'}
        ],
        'passwordVerif' : [
          {type: 'required', message: 'Valide su contraseña'}
        ],
        'same_password' : [
          {type: 'equalPasswords', message: 'Las contraseñas no son iguales'}
        ]
      }

      public static ERROR_DIAG = {
        'temp' : [
          {type: 'required', message: 'Es necesario ingresar su temperatura'},
          {type: 'pattern', message: 'Ingrese una cantidad válida'},
        ]
      }

      public static LEVEL_EXPLAIN = {
        'ninguno' :
        {message: 'Sintomas que por si solos no presentan peligro alguno a menos que se descuiden por bastante tiempo o bien las afectaciones percibidas hacia la personas sean en exceso'}
        ,
        'bajo' : 
          {message: 'Sintomas cuya persistencia por más de 3 días será necesario el checar con un médico'} 
        ,
        'medio' : 
          {message: 'Sintomas que pueden afectar su vida diaria debido a sus efectos'}
        ,
        'alto' : 
          {message: 'Sintomas que por su naturaleza o bien su persistencia se recomienda encarecidamente acudir con un médico'}
        ,
        'severo' : 
          {message: 'Si presenta alguno de estos sintomas es sumamente necesario el acudir con un especialista con el fin de tratar dicho sintoma, por lo regular requieren estudios'}
        
      }

      public static Zone_options = {
        'options' : ["Cabeza","Abdomen","Corporal","Pecho"]
      }
}