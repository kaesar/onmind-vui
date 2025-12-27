# Guía de Componentes OnMind-VUI

Conjunto selecto de componentes web basados en **Vue** y **Volt** (**PrimeVue** Unstyled & **TailwindCSS**), orientados al uso comun en formularios de datos.

**OnMind-VUI** incluye los siguientes componentes:

- `AsComplete`
- `AsBox`
- `AsButton`
- `AsCheck`
- `AsConfirm`
- `AsDatagrid`
- `AsDate`
- `AsEmbed`
- `AsEvent`
- `AsForm`
- `AsImage`
- `AsInput`
- `AsModal`
- `AsPopup`
- `AsRadio`
- `AsSelect`
- `AsSwitch`
- `AsText`
- `AsTime`
- `AsUpload`
- `AsVideo`

## Modo de Uso desde HTML Estático

```html
<!DOCTYPE html>
<html>
<head>
    <script src="/static/js/tailwind.min.js"></script>
    <link rel="stylesheet" href="/static/js/onmind-vui-v2.css">
    <script type="importmap">
    {
        "imports": {
            "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
        }
    }
    </script>
</head>
<body>
    <div id="app"></div>
    
    <script type="module">
        import '/static/js/app.js'
        
        const app = await window.initVueApp({
            data() {
                return {
                    usuarios: [
                        { id: 1, name: 'Juan', email: 'juan@example.com' },
                        { id: 2, name: 'María', email: 'maria@example.com' }
                    ],
                    columns: [
                        { key: 'name', header: 'Nombre' },
                        { key: 'email', header: 'Email' }
                    ],
                    selectedRow: null
                }
            },
            methods: {
                onRowSelect(row) {
                    this.selectedRow = row
                    console.log('Fila seleccionada:', row)
                }
            },
            template: '<AsDatagrid :data="usuarios" :columns="columns" selectable @row-select="onRowSelect" />'
        })
        app.mount('#app')
    </script>
</body>
</html>
```

El archivo `/static/js/app.js`  del ejemplo proporcionaría la función `window.initVueApp()` que:

1. **Crea la aplicación Vue** usando `createApp` de Vue 3
2. **Registra automáticamente todos los componentes** de OnMind-VUI globalmente
3. **Retorna la instancia** de la aplicación lista para montar

El código podría verse como el siguiente:

```javascript
import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
import AsDatagrid from './as-datagrid.js'

window.initVueApp = async function(componentOptions = {}) {
    const app = createApp({
        ...componentOptions
    })
    
    // Registra componentes globalmente
    app.component('AsDatagrid', AsDatagrid)
    // ... otros componentes As*
    
    return app
}
```

> Esto permite usar los componentes directamente en el template sin necesidad de importarlos individualmente.

## AsButton
Botón interactivo que puede mostrar mensajes toast o redirigir a enlaces.

**Propiedades:**
- `label` (String): Texto del botón
- `message` (String): Mensaje toast al hacer clic
- `link` (String): URL para redirección

**Ejemplo:**
```html
<AsButton label="Guardar" message="Datos guardados correctamente" />
<AsButton label="Ir al inicio" link="/home" />
```

<!-- document.querySelector('as-button').addEventListener('button-tap', () => {}) -->
---

## AsInput
Campo de entrada para texto, email, contraseña o números.

**Propiedades:**
- `label` (String): Etiqueta del campo
- `value` (String): Valor inicial
- `placeholder` (String): Texto placeholder
- `kind` (String): Tipo de input: 'text', 'email', 'password', 'number'

**Ejemplo:**
```html
<AsInput placeholder="Nombre completo" />
<AsInput kind="email" placeholder="correo@ejemplo.com" />
<AsInput kind="password" placeholder="Contraseña" />
<AsInput kind="number" placeholder="Edad" />
```

---

## AsCheck
Casilla de verificación (checkbox).

**Propiedades:**
- Usa v-model para enlace bidireccional

**Ejemplo:**
```html
<AsCheck v-model="aceptaTerminos" />
```

---

## AsSwitch
Interruptor de encendido/apagado (toggle).

**Propiedades:**
- `label` (String): Etiqueta junto al switch
- `checked` (Boolean): Estado inicial

**Ejemplo:**
```html
<AsSwitch label="Notificaciones" :checked="true" />
```

---

## AsRadio
Grupo de botones de opción (radio buttons).

**Propiedades:**
- `label` (String): Etiqueta del grupo
- `value` (String): Valor seleccionado inicial
- `options` (String): Opciones en formato "label=Texto,value=val;label=Texto2,value=val2"

**Ejemplo:**
```html
<AsRadio 
  label="Selecciona tu plan" 
  options="label=Básico,value=basic;label=Premium,value=premium;label=Enterprise,value=enterprise" 
/>
```

---

## AsSelect
Lista desplegable de selección (dropdown).

**Propiedades:**
- `label` (String): Texto placeholder
- `value` (String): Valor inicial seleccionado
- `options` (String): Opciones en formato "label=Texto,value=val;label=Texto2,value=val2"

**Ejemplo:**
```html
<AsSelect 
  label="Selecciona país" 
  options="label=México,value=mx;label=Colombia,value=co;label=España,value=es" 
/>
```

---

## AsComplete
Campo de autocompletado con búsqueda.

**Propiedades:**
- `label` (String): Placeholder del campo
- `value` (String): Valor inicial
- `options` (String): Opciones en formato "label=Texto,value=val;label=Texto2,value=val2"

**Ejemplo:**
```html
<AsComplete 
  label="Buscar ciudad" 
  options="label=Madrid,value=mad;label=Barcelona,value=bcn;label=Valencia,value=vlc" 
/>
```

---

## AsText
Área de texto multilínea (textarea).

**Propiedades:**
- `rows` (Number): Número de filas visibles (por defecto: 5)

**Ejemplo:**
```html
<AsText rows="5" />
```

---

## AsDate
Selector de fecha (date picker).

**Propiedades:**
- `label` (String): Etiqueta del campo
- `value` (String): Fecha inicial en formato ISO
- `placeholder` (String): Texto placeholder

**Ejemplo:**
```html
<AsDate placeholder="Selecciona fecha de nacimiento" />
<AsDate value="2024-01-15" />
```

---

## AsTime
Selector de hora (time picker).

**Propiedades:**
- `label` (String): Etiqueta del campo
- `value` (String): Hora inicial en formato HH:mm
- `placeholder` (String): Texto placeholder

**Ejemplo:**
```html
<AsTime placeholder="Selecciona hora" />
<AsTime value="14:30" />
```

---

## AsBox
Contenedor tipo tarjeta para agrupar componentes.

**Propiedades:**
- `dim` (String): 'true' para fondo atenuado, 'false' para fondo con sombra
- `theme` (String): 'light' o 'dark'

**Ejemplo:**
```html
<AsBox dim="false" theme="light">
  <h3>Título</h3>
  <p>Contenido de la tarjeta</p>
</AsBox>
```

---

## AsConfirm
Diálogo de confirmación con modal.

**Propiedades:**
- `label` (String): Texto del botón
- `message` (String): Mensaje de confirmación
- `link` (String): URL para redirección al confirmar

**Ejemplo:**
```html
<AsConfirm 
  label="Eliminar" 
  message="¿Estás seguro de eliminar este elemento?" 
/>
```

---

## AsDatagrid
Tabla de datos con ordenamiento, filtrado y paginación.

**Propiedades:**
- `data` (Array): Datos a mostrar
- `columns` (Array): Definición de columnas con formato `{ key: 'campo', header: 'Título' }`
- `pageSize` (Number): Elementos por página (por defecto: 15)
- `title` (String): Título de la tabla
- `theme` (String): 'light' o 'dark'
- `selectable` (Boolean): Permite seleccionar filas
- `pageable` (Boolean): Activa paginación
- `filterable` (Boolean): Activa búsqueda/filtrado
- `rowKey` (String): Campo que identifica de forma única cada fila (requerido para selección)

**Eventos:**
- `@row-select`: Se emite cuando se selecciona una fila. Recibe el objeto de la fila como parámetro.

**Ejemplo básico:**
```html
<AsDatagrid 
  title="Usuarios" 
  theme="light" 
  selectable 
  filterable 
  pageable 
  :data="usuarios"
  :columns="[
    { key: 'name', header: 'Nombre' },
    { key: 'email', header: 'Email' }
  ]"
  rowKey="id"
  @row-select="onRowSelect"
/>
```

**Ejemplo con manejo de selección:**
```javascript
const app = await window.initVueApp({
    data() {
        return {
            usuarios: [
                { id: 1, name: 'Juan', email: 'juan@example.com' },
                { id: 2, name: 'María', email: 'maria@example.com' }
            ],
            columns: [
                { key: 'name', header: 'Nombre' },
                { key: 'email', header: 'Email' }
            ],
            selectedRow: null
        }
    },
    methods: {
        onRowSelect(row) {
            this.selectedRow = row
            console.log('Usuario seleccionado:', row.name)
        },
        deleteUser() {
            if (!this.selectedRow) return
            // Lógica para eliminar usuario
            console.log('Eliminando:', this.selectedRow.id)
        }
    },
    template: `
        <div>
            <AsDatagrid 
                title="Usuarios" 
                theme="light" 
                selectable 
                filterable 
                pageable 
                :data="usuarios" 
                :columns="columns" 
                :pageSize="15"
                rowKey="id"
                @row-select="onRowSelect" 
            />
            <div v-if="selectedRow" class="mt-4">
                <button @click="deleteUser" class="bg-red-600 text-white px-4 py-2 rounded">
                    Eliminar {{ selectedRow.name }}
                </button>
            </div>
        </div>
    `
})
```

---

## AsImage
Componente para mostrar imágenes.

**Propiedades:**
- `url` (String): URL de la imagen

**Ejemplo:**
```html
<AsImage url="https://ejemplo.com/imagen.jpg" />
```

---

## AsVideo
Reproductor de videos de YouTube embebidos.

**Propiedades:**
- `url` (String): URL del video de YouTube (formato embed)

**Ejemplo:**
```html
<AsVideo url="https://www.youtube.com/embed/dQw4w9WgXcQ" />
```

---

## AsEmbed
Componente para embeber contenido web externo.

**Propiedades:**
- `url` (String): URL del contenido a embeber
- `width` (Number): Ancho en píxeles (por defecto: 1200)
- `height` (Number): Alto en píxeles (por defecto: 675)

**Ejemplo:**
```html
<AsEmbed url="https://www.ejemplo.com" />
<AsEmbed url="https://maps.google.com/..." :width="800" :height="600" />
```

---

## AsEvent
Campo de entrada que dispara eventos personalizados (útil para abrir modales, menús, etc.).

**Propiedades:**
- `label` (String): Etiqueta del campo
- `value` (String): Valor mostrado
- `placeholder` (String): Texto placeholder
- `event` (String): Nombre del evento a disparar (por defecto: 'event-trigger')
- `readonly` (Boolean): Solo lectura
- `disabled` (Boolean): Deshabilitado

**Eventos:**
- `@[event-name]`: Se emite cuando se hace clic. Recibe `{ value }`

**Ejemplo:**
```html
<AsEvent 
  label="Seleccionar archivo" 
  value="documento.pdf" 
  event="file-select" 
  @file-select="onFileSelect" 
/>
```

---

## AsModal
Diálogo modal con soporte para contenido dinámico.

**Propiedades:**
- `title` (String): Título del modal
- `open` (Boolean): Estado inicial del modal
- `theme` (String): Tema ('light' o 'dark')

**Eventos:**
- `@modal-close`: Se emite al cerrar el modal

**Métodos:**
- `show()`: Mostrar el modal
- `hide()`: Ocultar el modal

**Ejemplo:**
```html
<AsModal ref="modal" title="Editar Usuario">
  <AsForm :schema="userSchema" @form-submit="onSubmit" />
</AsModal>

<script>
function openModal() {
  modal.value.show()
}
</script>
```

---

## AsPopup
Menú contextual con posicionamiento inteligente y confirmación para acciones peligrosas.

**Propiedades:**
- `options` (String): Opciones en formato "label=Texto,value=val;label=Texto2,value=val2"
- `theme` (String): Tema del popup
- `open` (Boolean): Estado inicial

**Eventos:**
- `@option-select`: Se emite al seleccionar una opción. Recibe `{ value, label }`

**Métodos:**
- `show(x, y)`: Mostrar el popup en las coordenadas especificadas
- `hide()`: Ocultar el popup

**Ejemplo:**
```html
<AsPopup 
  ref="popup" 
  options="label=Editar,value=edit;label=Duplicar,value=duplicate;label=Eliminar,value=delete" 
  @option-select="onOptionSelect" 
/>

<script>
function showContextMenu(event) {
  popup.value.show(event.clientX, event.clientY)
}
</script>
```

---

## AsUpload
Componente de carga de archivos con soporte para arrastrar y soltar.

**Propiedades:**
- `label` (String): Texto del área de carga (por defecto: 'Upload files')
- `accept` (String): Tipos de archivo aceptados (por defecto: '*')
- `multiple` (Boolean): Permitir múltiples archivos
- `theme` (String): Tema del componente
- `disabled` (Boolean): Deshabilitado

**Eventos:**
- `@files-selected`: Se emite al seleccionar archivos. Recibe `{ files: Array }`

**Ejemplo:**
```html
<AsUpload 
  label="Subir imágenes" 
  accept="image/*" 
  multiple 
  @files-selected="onFilesSelected" 
/>

<script>
function onFilesSelected(data) {
  console.log('Archivos seleccionados:', data.files)
  // Procesar archivos
}
</script>
```

---

## AsForm
Formulario basado en esquemas con validación automática.

**Propiedades:**
- `schema` (Object): Esquema del formulario
- `theme` (String): Tema del formulario
- `successMessage` (String): Mensaje de éxito
- `errorMessage` (String): Mensaje de error
- `hideTitle` (Boolean): Ocultar título (útil dentro de modales)

**Eventos:**
- `@form-submit`: Se emite al enviar con validación exitosa. Recibe `{ formData }`
- `@form-cancel`: Se emite al cancelar
- `@field-change`: Se emite al cambiar cualquier campo. Recibe `{ fieldName, value, formData }`

**Métodos:**
- `getFormData()`: Obtener datos actuales del formulario
- `setFormData(data)`: Establecer datos del formulario
- `clearErrors()`: Limpiar todos los errores
- `validate()`: Validar formulario manualmente

**Ejemplo:**
```html
<AsForm 
  ref="form" 
  :schema="userSchema" 
  @form-submit="onSubmit" 
  @form-cancel="onCancel" 
/>

<script>
const userSchema = {
  title: 'Información de Usuario',
  sections: [
    {
      title: 'Datos Personales',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Nombre Completo',
          required: true,
          validation: ['required', 'min:2']
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email',
          required: true,
          validation: ['required', 'email']
        },
        {
          name: 'role',
          type: 'select',
          label: 'Rol',
          options: [
            { label: 'Usuario', value: 'user' },
            { label: 'Admin', value: 'admin' }
          ]
        }
      ]
    }
  ]
}

function onSubmit(data) {
  console.log('Datos del formulario:', data.formData)
}
</script>
```

### Validadores Disponibles
- `required` - Campo obligatorio
- `email` - Formato de email válido
- `min:n` - Mínimo n caracteres
- `max:n` - Máximo n caracteres

### Integración AsForm con AsModal

Cuando `AsForm` se usa dentro de `AsModal`, el modal automáticamente oculta el título del formulario:

```html
<AsModal title="Crear Usuario">
  <AsForm :schema="formSchema" @form-submit="onSubmit" />
</AsModal>
```