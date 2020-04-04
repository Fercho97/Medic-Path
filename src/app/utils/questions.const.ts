export class questions {
    public static QUESTIONS = {
        'fiebre' : [
          {type: 'numeric', message: '¿Cuál es o ha sido su temperatura corporal?', validValue: 37},
        ],
        'default' : [
          {type: 'boolean', message: ''},
        ],
        'deshidratación' : [
          {message: "¿Su secreción de liquidos(vomito,diarrea,sudoración) ha sido mayor a la cantidad de agua que ha ingerido ultimamente?", type: "boolean"}
        ],
        'encías color rojizo' : [
          {message: '¿Ha notado un color rojizo o bien diferente al color normal en sus encias?', type: "boolean"}
        ],
        'sangrado durante cepillado' : [
          {message: '¿Al cepillarse los dientes ha detectado sangrado?', type: "boolean"}
        ],
        'reacción alimentaria' : [
          {message: '¿Ha consumido algún alimento ultimamente que sienta que le haya caido mal?', type: "boolean"}
        ],
        'accesos en los dientes' : [
          {message: '¿Nota un agujero a simple vista en alguna pieza dental?', type: "boolean"}
        ],
        'reacción alérgenos' : [
          {message: '¿Ha estado en contacto con algún alérgenico ultimamente(polvo,polen,etc)?', type: "boolean"}
        ],
        'dientes manchados' : [
          {message: '¿Ha notado algúna mancha en sus dientes que persiste aún después de la limpieza?', type: "boolean"}
        ],
        'pérdida del apetito' : [
          {message: '¿Ultimamente ha tenido menos hambre de lo usual, o bien al comer siente que se llena más rápido?', type: "boolean"}
        ]
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

      public static SPECIFIC_NUMERIC_QUESTION = {
        'Deshidratación' : [
          {message: 'Del 1 al 10 tanto se ve afectado por la falta de agua'}
        ],
        'Debilidad': [
          {message: 'Del 1 al 10 indique que tanto afecta su vida diaria esta sensación de debilidad'}
        ]
      }
}