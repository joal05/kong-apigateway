# KONG-APIGATEWAY

Kong es un api gateway que se ejecuta frente a cualquier API RESTful y se extiende a través de complementos, que proporcionan funcionalidades y servicios adicionales más allá de la plataforma central.

## Requerimientos Iniciales:
Si bien Kong es platform agnostic los ejemplos que correremos a continuación fueron implementados en una distribución Linux Ubuntu 18.04 con los siguientes paquetes instalados:

  - Docker 19.03.2
  - Ansible 2.5.1

## 1. Instalación

Levantaremos una instancia Kong utilizando las siguientes imágenes docker:

  - kong:1.1.0
  - postgres:9.6
  - pantsel/konga

para lo cual ejecutaremos

```
$ sudo ansible-playbook kong-start.yaml
```

Para verificar que el playbook se haya ejecutado correctamente solo le hacemos un curl al puerto :8000 esperando un mensaje similar al siguiente:

```
$ curl localhost:8000
```
```
{"message":"no Route matched with those values"}
```
Chévere, ya tenemos un kong corriendo sin problemas y acabamos de consumir su api pública, para consumir la api administrativa solo debemos realizar un curl al puerto 8001 y tendremos bocha de texto que son las características principales de nuestra instancia Kong.
Si quieres cambiar los puertos de la api pública y administrativa puedes modificar el playbook *kong-start.yaml*, o modificar el archivo /etc/kong/kong.conf si es que no estas usando docker.

## 2. Asegurando la api administrativa

Pasa que no puedes dejar el acceso a la api administrativa asi nada más imaginate se mete cualquiera, para lo cual vamos a hacer algo asi, registrar la misma api admistrativa a algo mas legible detras de la api pública, tipo
```
localhost:8000/admin-kong
```
y nos tiene que salir el mismo resultado que hicimos al consumir el endpoint *localhost:8001*

Y para ponerle al menos una capa de seguridad le vamos a agregar el plugin JWT que nos ofrece kong, de esa manera vamos a necesitar un token para consumir esta api.

El siguiente paso es registrar un usuario administrador que pueda consumir la api registrada y finalmente vamos a crear reglas ACL para asociar nuestro usuario admin a las apis.

Todos estos pasos los podemos hacer realizando curls a la api administrativa, pero para resumir puedes ejecutar el playbook curl-kong.yaml, ya luego le das una mirada y ves que hace step by step
```
$ ansible-playbook curl-kong.yaml
```

Y listo, ya tenemos nuestro propio kong levantando y esperando ser de mucha utilidad administrando multitud de apis utilizando su bonito ecosistema de plugins