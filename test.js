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

fetch(
  "http://181.170.127.82/ApiInterface/api/Query/GetNearbyShops/?Token=C4CF8541BD184606B44F05C812CAFAF5"
)
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    main(data, -31.55492, -68.547311, 250);
  })
  .catch((err) => console.log(err));

//console.log(main(jsonData, -31.55492, -68.547311, 3));

//main(jsonData);
