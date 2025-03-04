# Proyecto: Gestión de Clientes - Frontend  

## Descripción  

Desarrollé este proyecto en **Angular 19+** como parte de una prueba técnica orientada a la gestión de clientes. La aplicación permite realizar operaciones de **CRUD** (Crear, Leer, Actualizar y Eliminar) sobre una lista de clientes y presenta un **Dashboard** con métricas clave.  

El sistema está diseñado para consumir datos desde una API externa ([DummyJSON Users](https://dummyjson.com/users)) y manejar la información de manera dinámica. Implementé formularios avanzados con **Reactive Forms**, lo que permite validaciones y una mejor experiencia de usuario.  

Me enfoqué en cumplir con los requisitos solicitados en la prueba, asegurando lo siguiente:  

- Un CRUD funcional y eficiente.  
- Validaciones en formularios con **Reactive Forms**.  
- Una Dashboard interactiva con gráficos dinámicos.  
- Uso de una arquitectura modular para escalabilidad.  
- Implementación de **Standalone Components** para mejorar el rendimiento y facilitar la reutilización de componentes.  

En las siguientes secciones explicaré cómo instalé, configuré y desarrollé la aplicación.  

## Instalación y configuración del proyecto  

### 1. Creación del entorno de trabajo  

Para organizar mejor el proyecto, creé una carpeta en la unidad **C:** dentro de una carpeta llamada **Programación**, y dentro de ella una subcarpeta llamada **angular**.  

**Ubicación del proyecto:**  

`C:\Programación\angular`  

### 2. Instalación de Angular CLI  

Para desarrollar en Angular, instalé **Angular CLI** (Command Line Interface) globalmente con el siguiente comando:  

```sh
npm install -g @angular/cli
```  

### 3. Creación del proyecto  

Dentro de la carpeta angular, generé el proyecto llamado **gestion-clientes** con el siguiente comando:  

```sh
ng new gestion-clientes
```  

Luego, me ubiqué dentro de la carpeta **gestion-clientes** y puse en marcha el servidor para comprobar que todo funcionara correctamente con:  

```sh
ng serve
```  

Cuando vi que el servidor se ejecutó correctamente mostrando la pantalla de inicio de Angular, comencé a estructurar las carpetas necesarias para el CRUD.  

## Implementación de Standalone Components  

Para mejorar la modularidad y el rendimiento de la aplicación, decidí utilizar **Standalone Components** en lugar de módulos tradicionales. Esto permitió reducir dependencias innecesarias y simplificar la estructura del proyecto.  

Ejemplo de un Standalone Component para la lista de clientes:

```sh
ng generate component clients/list --standalone
```

Cada componente independiente incluye sus propias dependencias y puede ser utilizado sin necesidad de declararlo dentro de un módulo. Esto hizo que la aplicación fuera más eficiente y escalable.  

## Componente FormComponent  

Este componente es un formulario que permite agregar o editar clientes. Lo construí utilizando **ReactiveFormsModule** y **FormBuilder** para asegurar validaciones en los datos ingresados.  

### Funcionalidades  

- **Entrada de datos:** Permite ingresar información del cliente como nombre, apellido, email, teléfono, edad, género, país, ciudad e IP.  
- **Validación:** Verifica que los campos obligatorios estén completos y que el email tenga un formato válido.  
- **Modo edición y creación:**  
  - Si recibe un cliente como `@Input()`, el formulario se llena con los datos existentes para editar.  
  - Si no hay cliente, permite agregar uno nuevo generando un ID aleatorio.  
- **Persistencia en memoria:** Usa `ClientService` para agregar o actualizar clientes en la base de datos en memoria.  
- **Cierre del formulario:** Al guardar o cancelar, emite un evento `@Output()` para cerrar el modal.  

## Dashboard  

Este módulo proporciona una interfaz gráfica para visualizar estadísticas clave sobre los clientes. Utilicé **Angular** y **ng2-charts** para representar los datos en gráficos dinámicos.  

Para implementarlo, seguí estos pasos:  

1. Instalé las dependencias del proyecto:  
   
   ```sh
   npm install
   ```  

2. Instalé las librerías para los gráficos:  
   
   ```sh
   npm install ng2-charts chart.js
   ```  

### Funcionalidades de la Dashboard  

- **Total de Clientes**  
- **Promedio de Edad**  
- **Distribución por Género**  
- **Clientes por Ciudad/País**  
- **Distribución por Teléfono**  

La **Dashboard** no está dentro de la carpeta **clients**, sino en **app/dashboard**, ya que la diseñé como un módulo independiente para mayor flexibilidad.  

## Servicios (/services)  

Implementé dos servicios principales en Angular para manejar los datos de los usuarios:  

### **ClientService (client.service.ts)**  

- Obtiene los datos de la API (https://dummyjson.com/users) y los guarda en memoria.  
- Permite agregar, editar y eliminar usuarios mientras la aplicación está corriendo, pero los cambios se perderán al recargar.  

### **DashboardService (dashboard.service.ts)**  

- Obtiene usuarios directamente de la API sin almacenarlos en memoria.  

Cuando se elimina un cliente en la **Gestión de Usuarios**, la **Dashboard** se actualiza automáticamente para reflejar los cambios.  

---  
Con esto, logré desarrollar una aplicación funcional y modular, asegurando que cumpliera con los requisitos de la prueba técnica.

