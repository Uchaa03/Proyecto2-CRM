# Cheatsheet de IndexedDB
**IndexedDB** es una herramienta que nos permite almacenar datos dentro del navegador, esta permite la creación de 
aplicaciones web con consultas pero sin la dependencia de una red, ya que te permite trabajar en local, 
porque utiliza el propio navegador.

Esta es asíncrona, lo que quiere decir que no sigue el código de ejecución línea a línea, sino que se puede estar 
lanzando mientras se ejecutan más cosas en el código, gracias a esto podemos agilizar la aplicación cuando tenemos 
funcionalidades de larga duración.

En resumen esta es una base de datos que está integrada en el navegador, y con la que podemos implementar 
aplicaciones web de gestión de datos como la que queremos implementar en este aprendizaje de uso.

## Estructuración funcional de IndexedDB

- Se abre una base de datos.
- Se crea un objeto de almacenamiento en la base de datos.
- Realizar transacciones para añadir obtener o modificar datos.
- Esperar la respuesta por escucha de clase de eventos DOM (Cuidado ya que es asíncrono).
- Interpretar o trabajar con el resultado obtenido.


## Utilización de IndexedDB

### Comprobar Compatibilidad del navegador
Principalmente, podemos encontrarnos en casos de navegadores antiguos, necesitemos usar prefijos predefinidos para cada
navegador, esto a día de hoy no es así, salvo en versiones muy antiguas del navegador, por lo tanto, por si acaso 
podemos implementar un comprobador de sí nuestro navegador soporta IndexedDB de forma integrada, y si no que nos muestre
un ``console.log()`` o un ``alert()``

````javascript
    if (!window.indexedDB) {
        //Si no es compatible te avisara al abrir la aplicación
        window.alert("Su Navegador No es compatible con IndexedDB");
    }
````

### Creación de la base de datos

Para la creación de la base de datos lo hacemos manejándola desde una variable con una petición, y gestionamos sus
eventos como con los selectores a través de la variable creada.
````javascript
    var request = window.indexedDB.open("MyBD", 1);
````

Este llama a la función ``open()`` cuya devuelve un resultado que se maneja con eventos a través de la petición 
realizada, abriendo el estado de la base de datos.

Le tenemos que pasar el nombre de la base de datos, y el segundo parámetro hace referencia a la versión de la base de
datos, que por predeterminado es 1 incluso si se deja en blanco, es importante esta porque cuando hay modificaciones 
estructurales en la base de datos, se dispara automáticamente el evento ``onupdradeneeded`` que incrementa la 
versión, debido a su cambio de estructura, es decir si tenemos un objeto usuario y agregamos otro para productos, este 
detecta que la estructura de la base de datos ya no es solo de usuarios y la actualiza a la siguiente versión 
cargando el cambio de contenido en el evento que se dispara.

Básicamente, se utiliza para las actualizaciones estructurales de la base de datos, pero manteniendo lo ya generado, 
útil en la expansión de una base de datos(en cuanto a una referencia de estructura de datos), sin tener que estar 
generando una nueva, y manteniendo los datos de las estructuras ya creadas.

### Generación de manipuladores de la base de datos

Una vez creamos la petición de apertura tenemos que manejar la petición, para ello agregamos los controladores de éxito
o error, y desde ahí podemos realizar acciones que sean necesarias en la aplicación web.

````javascript
    //.onerror para cuando falla la apertura de la base de datos
    request.onerror = (e) => {
        // Ejecutar algo cuando falla
    };
    //.onsucces cuando funciona correctamente 
    request.onsuccess = (e) => {
        // Ejecutar algo o el programa por ejemplo si esta ok
    };
````

###  Inicializar una base de datos
Una vez entendido el manejo de la solicitud ``open()`` con ``.onerror`` y ``.onsucces``, podemos crear la 
petición y almacenar la base de datos con conexión establecida en una variable de la siguiente manera:

Para ello lo haremos de la siguiente manera:
````javascript
    var db; //Variable en la que almacenaremos la instancia de la base de datos si va bien
    var request = indexedDB.open("Database");
        request.onerror = (e) => { //Si falla muestra una alerta de error en la petición
        alert("No se a permitido la petición de creación de base de datos");
    };
    request.onsuccess = (e) => {
        db = request.result; //Pasa el resultado de la base de datos a la variable en la que instanciamos la BD
    };
````

Y ahora a través de la variable ```bd``` podremos gestionar nuestra base datos.

### Manejo de errores en la base de datos
Con nuestra base de datos ya generada podemos manejar los eventos errores con la variable y ver qué error nos puede ir 
dando de la siguiente manera:

````javascript
    db.onerror = (e) => {
    //Gestión de los eventos que generen un error para mostrarlos en un alert
    alert("Database error: " + event.target.errorCode);
};
````

### Manejo de la actualización de la base de datos
Para manejar el evento de actualización de la base de datos y agregación de objetos, utilizamos el evento comentado 
anteriormente que es el que se utiliza para la creación de estructuras en la base de datos

````javascript
    //En la petición de creación agregamos tambien la de actualización en la que podemos crear los objetos que queramos
    request.onupgradeneeded = (e) => {
    let db = e.target.result;

    //Agregamos el almacen de objetos
    let objectStore = db.createObjectStore("name", { keyPath: "myKey" });
};
````

Con este evento podemos ir agregando estructuras de dato ObjectStore(que sería la tabla) en el que debemos de tener 
un ```keyPath```, debe ser la calve primaria y ya ahi declaramos los elementos del objeto que debe tener para almacenar.

Si quisiéramos llamar y agregar otra estructura de datos nueva solo tenemos que llamar a este evento y agregarla de la 
misma forma esto ahora que la versión suba y que se agregue la nueva estructura de datos.

Este reutilizará los controladores de error y acierto explicados anteriormente, para manejar la actualización.

En resumen utilizamos él ``onupgradeneeded`` para la creación o actualización de estructuras que a su vez actualiza 
la base de datos.

## Ejemplo de creación de la base de datos

````javascript
let db //Donde almacenaremos la instacia de la base datos para trabajar con ella
let objectStore //Para el manejo de el objeto se crea en la base de datos

//Creación de petición de apertura de base de datos
let request = indexedDB.open("DataBase", 1)

//Manejo de petición de apertura con creación de directa de estrucutas
request.onerror = (e) => {
    alert(`Hubo un error; ${e}`)
}

//Actualización de la base de datos
request.onupgradeneeded = (e) => {
    db = e.target.result
    
    //Creación ObjectStore que seria la tabla
    objectStore = db.createObjectStore("clientes",{keyPath: "id", autoIncrement: true})
    //Utilizamos autoincrement para generar un id automático
}
    //Ejemplo de declaración de valor unico con un indice que sirve para la busqueda por el elemento
    objectStore.createIndex("email","email",{unique: true})
    
    //Una vez generado utilizamos transacion.oncomplete para asegurarse de la creación del almacen
    objectStore.transaction.oncomplete = (e) => {
    //Almacenamos la transacción de datos en una variable    
    let addObjectStore = db
        .transaction("customers", "readwrite")
        .objectStore("customers");
        //Y con la variable de la transacción podemos agregar elementos con
    addObjectStore.add("valor a introducir")
    }
````

- ```keyPath``` Es la declaración de la clave única de nuestro objeto de almacenamiento esta puede ser generada
automáticamente con ``autoincrement``.
- ```.createIndex``` Podemos crear declaración para la búsqueda por ese valor único puede ser útil por ejemplo para 
los correos.
- ``.transaction`` Podemos hacer la agregación, lectura y eliminación de datos.

### Transacciones en IndexedDB

Las transacciones esperan dos elementos el objeto a modificar y la función que se quiere realizar por predeterminado
si no se declara nada están en ``readonly``.

También tenemos que controlar el manejo de las transacciones:

#### Agregar datos

````javascript
    transaction.oncomplete = (e) => {
        alert("Todo Ok!"); //Ok si se completa correctamente 
    };

    transaction.onerror = (e) => {
        //Manejo de errores en la transacción
    };

    //Transacción de agregación de datos al objeto
    let objectStore = transaction.objectStore("customers", "readwrite");
    for (let i in customerData) {
        let request = objectStore.add(customerData[i]);
        request.onsuccess = (e) => {
            //Se agregaron los datos al objeto
        };
    }
````

#### Eliminación de datos
````javascript
    let request = db.transaction("customers", "readwrite") //Selección de tipo de transacción y alamcen
    let obejctStore = tansaction.objectStore("customers") //Selección de objeto concreto a modificar
    let request = obejctStore.delete("444-44-4444"); //Le pasamos el keyPath a borrar
    request.onsuccess = (e) => {
    // Si esta bien el elmento se habra borrado
};
````

#### Obtener datos de la base de datos
````javascript
    let transaction = db.transaction(["customers"]);
    let objectStore = transaction.objectStore("customers");
    let request = objectStore.get("444-44-4444"); //Cogemos el valor por el keyPath
    request.onerror =  (e) => {
        //Control de errores, nos se a encontrado el elemento
    };
    request.onsuccess = (e) => {
        // Devuelve el elemento si lo encuentra
        alert("Name for SSN 444-44-4444 is " + request.result.name);
    };
````

#### Obtener todos los datos de un objeto con un cursor
````javascript
    // Abre una transacción en modo solo lectura ("readonly") solo queremos mostrar datos
    let transaction = db.transaction("customers", "readonly");
    
    // Obtiene el object store "clientes" de la transacción
    let objectStore = transaction.objectStore("customers");
    
    // Abre un cursor sobre la object store para iterar sobre los registros
    let request = objectStore.openCursor();

    // Maneja el evento onsuccess cuando el cursor se abre correctamente
    request.onsuccess = (e) => {
        // Obtiene el cursor de los resultados del evento
        let cursor = e.target.result;
        
        // Verifica si el cursor tiene un registro válido
        if (cursor) {
            // Manejo del muestreo de clientes 
                        
            // Continúa al siguiente registro del cursor
            cursor.continue();
        }
        // Si no tiene registros podemos mostrar un mensaje 

    };

    // Maneja el evento onerror si ocurre un error al abrir el cursor
    request.onerror = (e) => {
        // Manejar un error
    }
````
Esta funcionalidad es muy útil ya, que es similar a un foreach pero utilizando la gestión de la base de datos cursor 
clasico de base de datos básicamente.

En principio con esto sería suficiente para poder utilizar 

[Mozzila Web Docs - IndexedDB - Referencia utilizada](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
[Mozzila Web Docs - IndexedDB Cursors - Referencia utilizada](https://developer.mozilla.org/es/docs/Web/API/IDBCursor)