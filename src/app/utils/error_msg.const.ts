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
          {type: 'required', message: 'Debe seleccionar una fecha'}
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
}