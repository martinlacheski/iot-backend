# Lineamientos y convenciones para la colaboración en el repositorio

En esta sección podrán encontrar los lineamientos y convenciones que se debe respetar al realizar distintas actividades referidas a la colaboración en el repositorio.

- Creación de *issues* para las actividades realizadas.
- Creación de la *branch* para el desarrollo de las actividades.
- Creación de *pull request* para la integración de los avances.


## Issues

Los *issues* son los componentes que vamos a utilizar para representar las actividades que se deben realizar en el repositorio. Estas actividades pueden ser:

- Desarrollo en general.
- Corrección de errores.
- Mejoras en el código.
- Mejoras en la documentación.
- Nuevas funcionalidades.

## Creación de issues para las actividades realizadas

> 💡 Para crear un issue debe ir al [repositorio del proyecto](https://github.com/mlacheski/iot-backend). En la pestaña [issues](https://github.com/mlacheski/iot-backend/issues), hacer click en el botón `New issue`.

Para crear un issue debe completar los siguientes campos:
- **Title**: Titulo del issue.
- **Write**: Descripción del issue (opcional).
- **Assignees**: Asignar el issue a un usuario.
- **Labels**: Asignar etiquetas al issue (opcional).


## Creación ramas para la resolucion de ejercicios

La branch creada para resolver un ejercicio siempre debe tener como origen la rama `main`.

```sh
git checkout main
```

***(Opcional)*** Para asegurarnos que estamos en la rama `main` podemos ejecutar el siguiente comando:

```sh
git branch
```

El resultado debe ser similar a:

```sh
* main
```

***(Opcional pero recomendado)*** Asegurarnos que la rama está actualizada con el repositorio remoto:

```sh
git pull origin main
```

Se recomienda nombrar la rama siguiendo la siguiente convención:

```sh
<nombreusuario>_<tarea>
```

De esta manera, el comando para la creacion de rama quedaría:

```bash
# asegurandonos siempre que partimos de main
git checkout -b <nombreusuario>_<tarea>
```

## Mensaje de commit

En el mensaje de cada commit se debe completar la siguiente leyenda `fixes #<issue>` donde el issue es el número de issue asignado por GitHub al momento de su creación.

`fixes #641`

## Pull request de los avances

Para hacer pull request al repositorio, se debe realizar lo siguiente:

- [x] Haber realizado el commit de la solucion con su mensaje correspondiente.
- [x] Haber hecho push al repositorio del proyecto. 

    `git push origin <nombreusuario>_<tarea>`.

Una vez completado la lista de acciones, deben:

1. Ir al repositorio oficial, a la pestaña de `Pull requests` y click en el boton `New pull request`.

2. Seleccionar como destino del Pull Request el repositorio `mlacheski/iot-backend` y la branch `main`.

el pull request debera seguir la siguiente convencion:

**Titulo**: breve descripcion de lo que se realizo.

**Descripcion** (opcional): descripción de lo que se realizó y quien lo realizó.

## Revision de los ejercicios y cierre de los issues

Es posible que surgan sugerencias o comentarios en los PR a fin de mejorar el proceso de entrega de los avances. En este caso, se debe realizar las modificaciones solicitadas y volver a realizar un nuevo PR.