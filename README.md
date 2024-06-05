# APi en nest - Importante
Al arrancar la aplicación usted podrá observar datos de prueba en las tablas Client, Article y Organization esto con
el fin de que se puedan realizar pruebas rapidamente.


## Requisitos Previos

- docker
- docker compose

## Instalación

1. Clona este repositorio: 

```
git clone https://bitbucket.org/jcarrillo3/backend-test
```

2. Navega al directorio del proyecto: 
```
cd backend-test
```
3. Cambia de rama:

```
git checkout jesus-david-carrillo
```

4. Levantar el proyecto con docker-compose

```
docker-compose up
```

5. El comando anterior ejecutará el archivo docker-compose.yml

## Uso

1. Accede a la aplicación en tu navegador: 
```
http://localhost:3000/api/v1/auth/profile
```

## Crear usuario e iniciar sesión

1. puede observar la documentación en:

```
http://localhost:3000/docs
```
2. Acceda al link anterior y busque la sección **auth**

3. Cree un usuario.

4. Inicie sesión: al Iniciar sesión se devolverá un token de autenticación copielo y guardelo.

5. Todas las rutas están protegidas así que para realizar cualquier acción crud ingrese el Bearer Token en el campo 'Authorization' de la cabecera de la solicitud. esto en la parte superior derecha de la venta swagger

# Ejericios
- Teniendo en cuenta los campos de la tabla Articulo (article) wholesaleNumber (numero al por mayor) y wholesalePercentage (porcentaje de descuento al por mayor) realizar los correspondientes calculos de descuento si algun numero de articulos de la tabla factura detalle sobrepase la cantidad definida al por mayor.
- De ser posible, devolver en la misma respuesta el arreglo de factura detalle.
1. al consultar todas las facturas la respuesta estará en el siguiente formato **(recuerde iniciar sesión)**:

```
[
  {
    "id": 0,
    "date": "2024-06-02T18:13:50.829Z",
    "expiredDate": "2024-06-02T18:13:50.829Z",
    "clientId": 0,
    "grandTotal": 0,
    "grandTotalWithDiscount": 0,
    "totalCount": 0,
    "organization": {
      "id": 0,
      "name": "string",
      "email": "string",
      "phone": "string",
      "documentNumber": "string",
      "address": "string",
      "createdAt": "2024-06-02T18:13:50.829Z",
      "updatedAt": "2024-06-02T18:13:50.829Z",
      "deletedAt": "2024-06-02T18:13:50.829Z"
    },
    "client": {
      "id": 0,
      "name": "string",
      "documentType": "string",
      "documentNumber": "string",
      "address": "string",
      "createdAt": "2024-06-02T18:13:50.829Z",
      "updatedAt": "2024-06-02T18:13:50.829Z",
      "deletedAt": "2024-06-02T18:13:50.829Z"
    },
    "details": [
      {
        "articleId": 0,
        "numberItems": 0,
        "detailTotal": 0,
        "discount": 0,
        "totalDetailWithDiscount": 0
      }
    ]
  },
  ...
]
```
2. también puede consultar una factura proporcionando el id de la misma

- Devolver como servicio las 5 facturas con mayor cantidad de objetos comprados.
```
http://localhost:3000/api/v1/factures/top-items
```

- Devolver como servicio las 5 facturas con mayor cantidad de montos finales.
```
http://localhost:3000/api/v1/factures/top-total
```
## Otros servicios

### Crear facturas
1. para crear una factura usted puede usar este formato

```
{
  "clientId": 1,
  "details": [
    {
      "articleId": 1,
      "numberItems": 11
    },
    {
      "articleId": 2,
      "numberItems": 10
    },
    ...
  ]
}
```

## Actualizar facturas
1. para actualizar una factura usted puede usar este formato, es importante el campo details.
2. solo se actualizan los detalles de la factura
```
{
  "details": [
    {
      "articleId": 1,
      "numberItems": 12
    }
  ]
}
```
## Puede ver el resto en:

```
http://localhost:3000/docs
```

## Datos de contacto
1. **email:** `jesusdavid4521@gmail.com`

2. **Escribeme o llama:** 3001134675
