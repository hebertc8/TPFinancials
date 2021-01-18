#                Manual de uso Básico Angular


### Contenido

* [Como abrir y compilar el proyecto desde el Backend.](#id1)
* [Como abrir y compilar el proyecto desde el front.](#id2)
* [Crear un Componente.](#id3)
* [Funciones.](#id4)
* [Realizar consulta a base de datos.](#id5)
* [Recomendaciones.](#id6)
* [Contenido del proyecto.](#id7)
___ 
<div id='id1' />

## Como abrir y compilar el proyecto desde el Backend.

+ **Paso 1** 

Descargar repositorio donde está alojado el proyecto.

![AngularNodeJS](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/AngularNodeJS1.png)


Una vez con el repositorio guardado localmente procedemos con el inicio del proyecto.

+ **Paso 2**

**Nota** debemos estar en la ruta donde está la carpeta back-end

![AngularNodeJS](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/AngularNodeJS2.png)

Usar el comando cd y la carpeta a acceder que será back-end.


 + **Paso 3**

Descargar e Instalar librerías para la compilación del mismo , para ello usar el comando **npm i o npm install**

![AngularNodeJS](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/AngularNodeJS3.png)

Se mostrara los paquetes cargados.

![AngularNodeJS](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/AngularNodeJS4.png)

Debe aparecer un nuevo archivo llamado **node_modules** allí estarán las librerías descargadas. 

![AngularNodeJS](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/AngularNodeJS5.png)

Una vez termine de correr el comando estará listo el proyecto para su uso.

+ **Paso 5**

**Nota**: validar que en la carpeta back-end este el archivo **.env** ya que es el que contiene las rutas y usuarios de acceso necesarios para el proyecto.

![AngularNodeJS](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/AngularNodeJS6.png)

**Nota**: en caso de no tener el archivo **.env** solicitarlo al equipo de desarrollo.

Usar el comando **node index.js** para compilar el proyecto, este deberá generar los datos de compilación en el respectivo puerto junto con la fecha y hora.


![AngularNodeJS](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/AngularNodeJS7.png)





___ 


<div id='id2' />

## Como abrir y compilar el proyecto desde el front.


 + **Paso 1** 

Iniciar el proyecto en el front.

Ubicar la ruta donde está el front. 

![AngularNodeJS](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/AngularNodeJS8.png)


También es necesario descargar e instalar las librerías necesarias. 

Usar el comando **nmp i** 

![AngularNodeJS](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/AngularNodeJS9.png)

Paso 2

Ahora para compilar el proyecto en el front usar el comando **npm run ng serve**

![AngularNodeJS](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/AngularNodeJS10.png)


Deberá mostrar el mensaje **Compiled Successfully** donde confirma la compilación del front.

Ahora que ya esta el back y el front compilados se tendra disponible el acceso al proyecto DisDev.

![AngularNodeJS](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/AngularNodeJS12.png)

Usar las credenciales de CCMS.

![AngularNodeJS](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/AngularNodeJS13.png)



Con los pasos anteriormente indicados se obtendrá la visibilidad del proyecto junto con algunas opciones de consultar SQL editar agregar y eliminar registros.



____
<div id='id3' />

## Crear un Componente. 


+ **Paso 1**


Para crear un componente es necesario estar en la ruta container dentro del front.

![AngularNodeJS](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/AngularNodeJS14.png)


+ **Paso 2**

Para crear un nuevo componente se necesita el comando 
~~~
npm run ng g c "nombre del componente" --skipTests
~~~

![AngularNodeJS](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/AngularNodeJS15.png)

Validar que se creó el componente dentro de la carpeta container.

![AngularNodeJS](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/AngularNodeJS16.png)

Adicional también se cargara  en la sección app.modules.ts quedando listo para ser usado en el proyecto.


+ **Paso 3**

Crear el contenido del componente, en este caso será un botón como ejemplo.

![AngularNodeJS](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/AngularNodeJS17.png)


Al momento de guardar se volverá a compilar , quedando el cambio en el front, ya con esto guardado debemos aplicar el cambio al back-end para que pueda ser un componente visible y usable.


 + **Paso 4**

Es necesario indicar donde debe mostrar el componente creado para ello ir al archivo **app-routing.module.ts**

![AngularNodeJS](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/AngularNodeJS18.png)

En este se le dirá que componente debe mostrar, en este momento se encuentra en *container/main* 

![AngularNodeJS](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/AngularNodeJS19.png)

![AngularNodeJS](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/AngularNodeJS20.png)

+ **Paso 5**


Ahora se añadirá otro hijo que llamara al componente que se ha creado.

      {
        path: 'trainingtest',  ----> "será el nombre"
        component:TrainingtestComponent,, ----> "Sera el componente que se ha creado"
        canActivate: [ValidateLoginGuard]
      },


![AngularNodeJS](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/AngularNodeJS21.png)

Adicional se evidencia que se importó el componente.

![AngularNodeJS](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/AngularNodeJS22.png)


Ahora al guardar,  automáticamente  volverá a compilar el proyecto.


![AngularNodeJS](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/AngularNodeJS23.png)


Al validar desde el navegador en el *localhost:4200/main/trainingtest* que fue el nuevo componente se observa el botón creado.


![AngularNodeJS](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/AngularNodeJS24.png)

___

<div id='id4' />

## Funciones.


+ **Paso 1**

Es necesario usar el archivo **trainingtest.component.ts**

![AngularNodeJS](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/AngularNodeJS25.png)

+ **Paso 2**


Proceder a crear la función necesaria, como ejemplo será una que nos genere una notificación al hacer click en el botón creado anteriormente.


![AngularNodeJS](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/AngularNodeJS26.png)

En este caso la función ha sido creada y guardada pero es necesario llamarla en el botón creado.


+ **Paso 3**

Volver  al archivo **.html** donde se creó el botón para agregar la función.


![AngularNodeJS](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/AngularNodeJS27.png)


Al momento de guardar  volverá a compilar el proyecto y en el navegador estará la función creada.


![AngularNodeJS](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/AngularNodeJS28.png)

___

<div id='id5' />

## Realizar consulta a base de datos.


+ **Paso 1**

En la ruta del Front se encuentra la carpeta llamada **Service**  en ella está el archivo *request.service.ts* en este se encuentra la información de conexión con la base de datos
Para obtener o actualizar la información en ella.


![AngularNodeJS](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/AngularNodeJS29.png)



+ **Paso 2**
 
Volver al componente creado y crear una variable que será la que traerá la información consultada.

![AngularNodeJS](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/AngularNodeJS30.png)

Adicional es necesario indicar donde va a enviar la información, como ejemplo será en la consola del navegador.


![AngularNodeJS](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/AngularNodeJS31.png)




Al validar nuevamente el navegador, hacer click en el botón y verificar la consola del navegador donde se obtendrá la información solicitada a la base de datos.

![AngularNodeJS](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/AngularNodeJS33.png)

______
<div id='id6' />

## Recomendaciones


+ Usa 'request.service' para centralizar las solicitudes al back.
+ Revisa los guard de angular, puedes proteger los componentes según criterios específicos.

____
<div id='id7' />

## Contenido del proyecto:

* [Guards angular](https://angular.io/guide/router#preventing-unauthorized-access)
* [Interceptor angular](https://angular.io/api/common/http/HttpInterceptor)
* [localStorage](https://developer.mozilla.org/es/docs/Web/API/Window/localStorage)
* [formularios reactivos](https://angular.io/guide/reactive-forms)
* [nebular](https://akveo.github.io/nebular/docs/components/components-overview)
* [boostrap 4](https://getbootstrap.com/docs/4.5/getting-started/introduction/)
* [eva icons](https://akveo.github.io/eva-icons/#/)
* [ng2 smart table](https://akveo.github.io/ng2-smart-table/#/)
