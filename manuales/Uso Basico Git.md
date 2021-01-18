#                Manual de uso Bsico de Git


**Índice**   
1. [Clonar Repositorio](#id1)
2. [Subir un cambio con Git](#id2)
3. [Como Hacer un Merge](#id3)
4. [Como subir los cambios a un repositorio en la nube](##id4)

___



En este manual encontraran los aspectos básicos para iniciar el uso de Git.
___

<div id='id1' />

## Clonar Repositorio

+ **Paso 1**

Es necesioita la URL del repositorio que se desea clonar.

+ **Paso 2**

Crear una carpeta donde copiará el repositorio.

![Clonar   repositorio 1](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/Clonar1.png)

+ **Paso 3** 
Copiar la URL donde está alojado el repositorio.

               En ejemplo será uno  en Github

![Clonar   repositorio 2](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/Clonar2.png)


+ **Paso 4**

Hacer Click derecho en la carpeta creada y Seleccionar la opción **Git Bash Here**

![Clonar   repositorio 3](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/Clonar3.png)


Se abrirá el editor de Git. 

![Clonar   repositorio 4](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/Clonar4.png)


+ **Paso  5**

Usar el comando:

**Git clone** y la URL del repositorio.

![Clonar   repositorio 5](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/Clonar5.png)

Se Cargara la información del repositorio.

![Clonar   repositorio 6](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/Clonar6.png)


+ **Paso 6**
En la carpeta creada quedaran los archivos descargados localmente del repositorio.

![Clonar   repositorio 7](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/Clonar7.png)


De esta forma quedaran los archivos guardados localmente para hacer uso de ellos.


___
<div id='id2' />

## Subir un cambio con Git

+ **Paso 1**
Abrir el proyecto. 

![Cambios 1](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/Cambio1.png)

Iniciar el proyecto con el comando

 **Git init**

![Cambios 2](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/Cambio2.png)

+ **Paso 2**


Realizar los cambios o modificaciones en el proyecto.

Al visualizar el explorador de soluciones se evidencia los cambios que no se han agregado.


![Cambios 3](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/Cambio3.png)


+ **Paso 3**

Usar el comando **git status**

Para validar que elementos nuevos encuentra. 

![Cambios 4](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/Cambio4.png)

Se veran resaltados en rojo las modificaciones o archivos nuevos que encuentra pero no se han guardado.

+ **Paso 4**

Agregar los archivos para subir repositorio con el comando **git add -A**

![Cambios 5](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/Cambio5.png)

Usar el comando **git status**

![Cambios 6](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/Cambio6.png)

Se verán reflejados los cambios listos para agregarlos al repositorio.

+ **Paso 5**

Para subir los cambios usar el comado **git commit -m "Descripción"**

En la descripción se especificara que cambios se están subiendo.

![Cambios 7](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/Cambio7.png)


Validar en el explorador de soluciones que el cambio se realizo correctamente. 


![Cambios 8](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/Cambio8.png)

De esta forma  el cambio o modificación se ha guardado en el repositorio localmente.
___

<div id='id3' />

## Como Hacer un Merge.


+ **Paso 1**

Iniciar el proyecto usando el comando **git init**

![merge 1](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/merge1.png)




+ **Paso 2**

Crear una rama que será donde se realizaran los cambios para luego generar el merge a la rama principal llamada **Master**

Usar el comando **git branch "nombre"**

![merge 2](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/merge2.png)


+ **Paso 3**

Después de crear la nueva rama, es necesario posicionarnos en ella.


Usar el comando **git checkout "nombre de la rama"**

![merge 3](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/merge3.png)

En la ruta se observa que esta situada en la rama **pruebamerge** o usar el comando **git branch**


![merge 4](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/merge4.png)

En verde  resaltara la rama donde se encuentra posicionado.


+ **Paso 4**

Una vez hecho esto, proceder a realizar  cambios o modificaciones en algún archivo del repositorio o crear uno nuevo.

![merge 5](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/merge5.png)
+ **Paso 5**

Con los cambios realizados,bagregarlos al repositorio.

Usar el comando **git add -A**

![merge 6](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/merge6.png)

A continuación se cargarn los cambios al repositorio en la rama creada

Usar el comando **git commit -m "Descripción"**

![merge 7](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/merge7.png)

Después de haber realizado el commit, es necesario volver a la rama **Master** para unificar los cambios.

+ **Paso 6**

Usar el comando **git checkout master** para volver a la rama principal.

![merge 8](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/merge8.png)

Estando en la rama principal usar el comando **git merge pruebamerge** para realizar la unión.


![merge 9](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/merge9.png)

se observan los cambios guardados en la rama principal.

![merge 10](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/merge10.png)

___


<div id='id4' />


## Como subir los cambios a un repositorio en la nube.

Es necesario tener un repositorio en la nube donde realizar el push.

+ **Paso 1**

Iniciar el proyecto.


Usar el comando **Git init**

![push 1](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/merge1.png)

+ **Paso 2**

Es necesario tener commits realizados.

Para subir los cambios, primero se debe crear una conexión con el repositorio.

Usar el comando **git remote add origin https://github.com/juansanchez9618/Prueba-TP.git**

Es necesario la URL donde esta esta el repositorio en la nube, en este ejemplo se utilizara uno de prueba.

![push 2](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/push2.png)

+ **Paso 3**

Ya existe la unión al repositorio, ahora se solicitara subir los cambios a dicho repositorio.

Usar el comando **git push -u origin master**

La primera vez  solicitara las credenciales del repositorio.


![push 3](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/push6.png)



Después de confirmar las credenciales empezara a subir la información al repositorio.


![push 4](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/push4.png)


Una vez finalice se puede validar en github o donde tengamos el repositorio que ya están los cambios.

![push 5](https://raw.githubusercontent.com/juansanchez9618/Training-Area/master/Material/Capturas/push5.png)


+ **Paso 4**

Ya como existe la conexión del repositorio local con github cuando se generen cambios para  subir.

Usar el comando **git push**


<!--stackedit_data:
eyJoaXN0b3J5IjpbMTA5MjE0NjE2Nl19
-->