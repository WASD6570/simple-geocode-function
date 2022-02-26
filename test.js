import main from "./index.js";
import jsonData from "./test.json" assert { type: "json" };

////////////////////////////////

// funcion exportada de index.js,
// recibe: jsonComercios (array de objetos), latitud (number), longitud (number), radio (number).
// Puede funcionar si le pasan solo un array de objetos con las propiedades encontradas
// en el archivo test.json
// La funcion prioriza los datos recibidos por parametros, con la finalidad de testear
// se incluyo formularios para cambiar el radio y la ubicacion del user en index.html
// si se va a testear de la forma descripta en la linea superior se recomienda solo
// pasarle a la funcion main un array de objetos compatible.

main(jsonData, -31.55492, -68.547311, 1.2);

//main(jsonData);
