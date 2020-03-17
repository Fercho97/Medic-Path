export class questions {
    public static QUESTIONS = {
        'fiebre' : [
          {type: 'numeric', message: '¿Cuál es o ha sido su temperatura corporal?', validValue: 37},
        ],
        'default' : [
          {type: 'boolean', message: ''},
        ],
      }

      public static MULTIQUESTIONS = {
        'dolor de cabeza': [
          {message: '¿Como describiría su dolor de cabeza?'}
        ],
        'hinchazón': [
          {message: '¿En que parte del cuerpo presenta hinchazón?'}
        ],
        'dolor abdominal' : [
          {message: '¿En que parte del abdomen presenta dolor?'}
        ]
      }

      public static MULTIQUESTIONS_DOC = {
        'dolor de cabeza': [
          {message: '¿Como describe su paciente su dolor de cabeza?'}
        ],
        'hinchazón': [
          {message: '¿En que parte del cuerpo presenta la hinchazón su paciente?'}
        ],
        'dolor abdominal' : [
          {message: '¿En que parte del abdomen presenta dolor el paciente?'}
        ]
      }
}