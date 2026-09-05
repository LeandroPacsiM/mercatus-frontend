# Mercatus - Especificación funcional

**Versión:** 2.9  
**Tipo de documento:** Especificación funcional no técnica  
**Producto:** Mercatus, plataforma SaaS multi-tienda  
**Base:** `InformeFullStack.docx`, requisitos RF-001 a RF-026, reglas RN-01 a RN-10 e historias HU-001 a HU-045

## 1. Propósito y alcance

Mercatus es una plataforma SaaS que permite a propietarios crear y administrar tiendas digitales independientes. Cada tienda puede publicar un catálogo, controlar existencias, recibir pedidos y ofrecer una experiencia pública de compra. Mercatus presta la plataforma; no vende productos directamente.

El alcance del MVP académico comprende:

- Registro, inicio y cierre de sesión.
- Tres perfiles funcionales: Administrador de Plataforma, Propietario de Tienda y Cliente Final.
- Creación y configuración de varias tiendas por propietario.
- Productos, categorías e inventario aislados por tienda.
- Storefront público, carrito, checkout y pedido simulado.
- Gestión de pedidos, estados y seguimiento simulado.
- Planes con límite de productos.
- Supervisión global de tiendas, usuarios y planes.

Quedan fuera del MVP los pagos bancarios reales, la facturación electrónica oficial, la logística externa, las aplicaciones móviles nativas, un marketplace entre tiendas, una tienda de aplicaciones y analítica avanzada.

### 1.1 Estado de veracidad de esta especificación

Este documento define el comportamiento funcional esperado y, además, identifica qué parte puede demostrarse actualmente en el frontend. No debe interpretarse que toda regla descrita ya está terminada.

El frontend actual es una **demo funcional con datos locales**. La autenticación, el carrito, los clientes y los pedidos conservan parte de su estado local; las tiendas, productos, categorías, inventario, configuración, planes y estados administrativos se conservan ahora en `localStorage` del navegador. Esta persistencia sirve para la demo, pero no representa todavía una fuente central ni una persistencia definitiva multiusuario.

Las integraciones de pago, entrega digital, notificaciones, seguimiento externo y seguridad de producción no pueden confirmarse solo desde este frontend. Cuando una historia dependa de ellas, debe considerarse una simulación o una capacidad futura, no una integración real.

### 1.2 Alcance de la persistencia local

Cuando una persona crea o modifica una tienda, producto, categoría, inventario, plan, activación o suspensión administrativa, el cambio permanece al recargar en el mismo navegador. No se sincroniza con otros navegadores, dispositivos o usuarios y puede perderse si se limpia el almacenamiento del navegador. El storefront lee estos datos locales para reflejar los cambios realizados en el panel.

### 1.1 Principio de orientación

Mercatus debe poder ser comprendido por una persona que entra por primera vez sin conocer Shopify ni la terminología del sistema. Cada pantalla inicial debe responder tres preguntas: **qué es este espacio, qué puedo hacer aquí y cuál es el siguiente paso recomendado**.

La experiencia debe separar desde el inicio dos recorridos diferentes:

- **Quiero crear y administrar una tienda:** recorrido del Propietario de Tienda.
- **Quiero comprar en una tienda:** recorrido del Cliente Final.

El Administrador de Plataforma utiliza un recorrido interno distinto y no debe confundirse con el propietario que administra su negocio.

## 2. Actores y responsabilidades

| Actor | Puede hacer | No debe hacer |
|---|---|---|
| **Administrador de Plataforma** | Supervisar usuarios, tiendas, planes y actividad global; editar configuraciones globales. | Operar una tienda como si fuera su propietario sin el contexto y permisos correspondientes. |
| **Propietario de Tienda** | Crear varias tiendas, configurar su identidad, administrar productos, categorías, inventario, pedidos, métricas y plan. | Consultar o modificar datos de tiendas que no le pertenecen. |
| **Cliente Final** | Registrarse, explorar una tienda activa, consultar productos, comprar, revisar pedidos y solicitar cancelación de pedidos pendientes. | Gestionar catálogos, inventarios, planes o pedidos de otros clientes. |

### 2.1 Entrada recomendada para cada actor

| Necesidad de la persona | Entrada | Primer objetivo visible |
|---|---|---|
| Crear una tienda | Landing → **Crear mi tienda** → Registro | Crear la primera tienda |
| Administrar tiendas existentes | Login → Panel del propietario | Elegir una tienda o crear otra |
| Comprar | Enlace directo a una tienda → Catálogo | Ver productos y agregar al carrito |
| Revisar una compra | Storefront → **Mis pedidos** | Consultar el estado del pedido |
| Supervisar Mercatus | Login de administrador → Panel de plataforma | Revisar tiendas, usuarios y planes |

El registro debe explicar qué tipo de cuenta se está creando. Si un mismo correo puede participar como propietario y cliente, la especificación debe indicar cómo se elige o cambia el contexto; no debe dejar esa decisión implícita.

## 3. Conceptos principales

- **Plataforma:** servicio que aloja y coordina varias tiendas independientes.
- **Tienda:** espacio comercial de un propietario, identificado por un nombre y un slug único.
- **Storefront:** página pública de una tienda donde el cliente consulta y compra.
- **Producto:** artículo físico o digital ofrecido por una tienda, con precio, categoría, stock y tipo de cumplimiento.
- **Categoría:** agrupación de productos de una misma tienda.
- **Inventario:** cantidad disponible de cada producto.
- **Pedido:** compra asociada a un único cliente y a una única tienda.
- **Plan:** modalidad de suscripción que determina precio, límite de productos y beneficios.
- **Cumplimiento:** forma de entregar el producto: envío, descarga digital o retiro en tienda.

## 4. Reglas de negocio

### 4.1 Identidad, acceso y permisos

1. Un correo electrónico solo puede estar asociado a una cuenta.
2. El correo y la contraseña son obligatorios para registrar una cuenta.
3. Las credenciales deben validarse antes de iniciar sesión.
4. Las rutas privadas requieren una sesión activa.
5. Las acciones disponibles dependen del rol autenticado.
6. El propietario solo administra sus propias tiendas.
7. El administrador puede supervisar la plataforma, pero el contexto de una tienda debe mantenerse visible al operar sobre sus datos.

### 4.2 Tiendas y multi-tenancy

8. Un propietario puede poseer varias tiendas.
9. Cada tienda requiere nombre, slug único y propietario autenticado. En el frontend, esta validación se realiza contra las tiendas cargadas durante la sesión.
10. El slug solo admite un identificador válido y no puede repetirse en la plataforma.
11. Una tienda nueva se crea activa, salvo que una acción administrativa indique lo contrario.
12. Solo el propietario o el administrador puede cambiar la configuración de una tienda.
13. Una tienda inactiva no debe mostrarse como storefront operativo. Actualmente el acceso directo por slug aún requiere completar esta validación.
14. Productos, categorías, inventario, carritos y pedidos siempre pertenecen a una tienda.
15. Nunca se mezclan productos de dos tiendas en un mismo carrito o pedido.

### 4.3 Catálogo e inventario

16. Un producto requiere nombre, descripción, precio, categoría y stock inicial.
17. Todo producto pertenece obligatoriamente a una categoría y a una tienda.
18. El stock disponible no puede ser negativo.
19. Un producto sin stock no debe ofrecerse como disponible para compra. El catálogo deshabilita la compra, pero el carrito existente todavía puede conservar cantidades inválidas.
20. Un propietario puede crear, editar, activar y desactivar productos de sus tiendas.
21. Una categoría solo puede administrarse dentro de su tienda.
22. Una categoría con productos asociados no puede eliminarse directamente; debe desactivarse o reorganizarse primero.
23. El límite de productos activos debe depender del plan de la tienda. Actualmente el frontend cuenta productos registrados, incluidos los inactivos.
24. Al alcanzar el límite del plan, la creación de nuevos productos se bloquea y se informa la posibilidad de cambiar de plan.
25. La confirmación de una compra debe descontar el stock de la tienda correspondiente. Esta operación todavía no está implementada en el frontend.

### 4.4 Pedidos, pagos y cumplimiento

26. Un pedido requiere un cliente autenticado, una tienda, al menos un producto disponible y cantidades válidas.
27. El pedido conserva la tienda de origen, sus productos, precios y cliente asociado.
28. Los estados objetivo son: **pendiente**, **confirmado**, **en preparación**, **enviado**, **entregado** y **cancelado**. El frontend actual no incluye de forma consistente el estado **en preparación**.
29. El cliente puede cancelar únicamente un pedido pendiente.
30. Un pedido cancelado no vuelve a descontar stock ni puede reactivarse por el cliente.
31. El propietario actualiza los estados de los pedidos de sus tiendas.
32. El seguimiento y el número de guía son opcionales hasta que el pedido sea enviado.
33. El método de pago se selecciona durante el checkout y se registra como simulado en el MVP.
34. Los productos digitales deben entregarse después de confirmar el pago simulado. Actualmente solo se muestra una confirmación o enlace de demostración; no existe una entrega individual verificable.
35. Los productos físicos pueden usar envío o retiro en tienda según su configuración.

### 4.5 Planes y administración

36. Cada tienda tiene un único plan vigente.
37. El propietario puede consultar su plan y solicitar un cambio entre Gratis, Básico y Pro.
38. El administrador puede definir nombre, precio, límite de productos y características de los planes.
39. Un cambio de plan no debe borrar productos existentes; solo modifica las condiciones aplicables hacia adelante.
40. Las métricas del propietario se calculan dentro de una tienda; las del administrador pueden consolidarse a nivel de plataforma.

41. Todo usuario autenticado puede consultar su perfil y cerrar su sesión actual.
42. El cierre de sesiones en otros dispositivos requiere gestión real de sesiones; en el MVP solo se presenta como una capacidad de seguridad futura o simulada.

### 4.6 Alcance del Administrador de Plataforma

El Administrador de Plataforma supervisa Mercatus a nivel global. Sus funciones principales son consultar tiendas y usuarios, administrar planes, revisar métricas, atender reportes y aplicar medidas administrativas como activar o suspender una tienda.

No administra normalmente el catálogo, precios, inventario, categorías ni pedidos de una tienda. Puede acceder a una vista de soporte o supervisión de solo lectura cuando sea necesario investigar un problema. Cualquier intervención excepcional debe quedar identificada como acción administrativa y no confundirse con la operación comercial del propietario.

La primera etapa visual del panel administrativo incluye navegación global, dashboard de plataforma, supervisión interactiva de tiendas, consulta básica de usuarios, actividad demo, reportes globales sencillos y configuración visual de planes. Las acciones administrativas usan datos locales durante la sesión y no representan todavía una administración persistente o completa.

## 5. Historias de usuario priorizadas

### 5.0 Orientación del usuario nuevo

**HU-000 - Entender el siguiente paso.** Como usuario nuevo, quiero identificar qué puedo hacer en Mercatus y cuál es el siguiente paso recomendado para no perderme al entrar.  
**Aceptación:** la landing diferencia “crear una tienda” de “comprar”; el registro indica el tipo de cuenta; el primer acceso muestra una bienvenida contextual; cada espacio ofrece una acción principal visible y una navegación coherente.

**HU-000A - Completar el primer recorrido del propietario.** Como propietario que aún no tiene tiendas, quiero una guía para crear y publicar mi primera tienda.  
**Aceptación:** el sistema indica una secuencia mínima: crear tienda, configurar identidad, crear categoría, agregar producto y revisar storefront; cada paso muestra su estado; al terminar se ofrece visitar la tienda.

**HU-000B - Encontrar el acceso de cliente.** Como visitante que quiere comprar, quiero saber cómo llegar a una tienda y consultar mis pedidos.  
**Aceptación:** la landing explica que Mercatus aloja tiendas independientes; el storefront muestra catálogo, carrito y acceso a pedidos; una ruta sin tienda válida informa cómo corregirla.

### 5.1 Autenticación y cuenta

**HU-001 - Registro.** Como visitante, quiero crear una cuenta indicando si deseo administrar una tienda o comprar para acceder al recorrido correcto.  
**Aceptación:** se solicita correo, contraseña y propósito de la cuenta cuando sea necesario; el correo debe tener formato válido y no estar registrado; al completar el registro se informa el siguiente paso.

**HU-002 - Inicio de sesión.** Como usuario registrado, quiero iniciar sesión para acceder a mis funciones.  
**Aceptación:** las credenciales se validan; una sesión válida permite entrar a recursos privados; una sesión inválida muestra un mensaje comprensible.

**HU-003 - Perfil.** Como usuario autenticado, quiero consultar y actualizar mis datos para mantenerlos vigentes.  
**Aceptación:** solo el propio usuario puede modificar su información; los datos obligatorios no pueden quedar vacíos. **Estado actual:** el menú de cuenta permite editar nombre y correo durante la sesión; cambio de contraseña y sesiones de otros dispositivos están pendientes.

### 5.2 Propietario de tienda

**HU-004 - Crear tienda.** Como propietario, quiero crear una tienda digital para vender bajo mi propia marca.  
**Aceptación:** el nombre y slug son obligatorios; el slug es único; la tienda queda asociada al propietario y disponible para configurar. **Estado actual:** el panel sin tiendas muestra el recorrido recomendado y un CTA para crear la primera tienda; la tienda creada se conserva en `localStorage` y puede ser leída por el storefront del mismo navegador.

**HU-005 - Configurar tienda.** Como propietario, quiero definir nombre, descripción, logo, dominio y apariencia para representar mi marca.  
**Aceptación:** solo propietario o administrador puede guardar cambios; la configuración se refleja en el storefront; una tienda inactiva deja de estar disponible públicamente. **Estado actual:** **Configuración** se reserva para datos generales de la tienda: nombre, descripción, logo, estado, URL pública y plan. La personalización visual se concentra en la sección independiente **Temas**, para evitar duplicar opciones; el dominio, pagos, envíos e impuestos quedan para fases posteriores.

La tienda también dispone de una sección independiente **Temas**, con tres bases visuales prediseñadas, vista previa gráfica, estado del tema publicado y publicación persistida por tienda. El editor visual básico permite activar u ocultar las secciones Banner principal, Productos destacados, Categorías y Pie de página, diferenciando los cambios en borrador de la publicación. La personalización avanzada de bloques, orden libre y plantillas queda para una fase posterior.

El storefront utiliza ahora esas opciones en su portada: muestra un banner de bienvenida, categorías rápidas y productos destacados cuando están activados, y cambia la composición y el mensaje principal según el tema Minimal, Índigo o Esmeralda seleccionado.

La experiencia pública también incluye navegación entre Inicio, Catálogo, Nosotros y Contacto; un footer con accesos a Envíos y Devoluciones; páginas informativas básicas; y mensajes explícitos cuando el slug no existe o la tienda está inactiva. La búsqueda continúa disponible dentro del catálogo.

La portada fue enriquecida con un encabezado responsive con menú móvil, marca contextual de la tienda, iconos para búsqueda y carrito, tarjetas de productos de mayor presencia visual y una sección de productos destacados enlazada al detalle.

**HU-006 - Gestionar productos.** Como propietario, quiero crear, editar, activar y desactivar productos para mantener mi catálogo.  
**Aceptación:** el producto exige datos mínimos, categoría y stock; no se permite superar el límite del plan; un producto desactivado no aparece como disponible. **Estado actual:** el formulario permite crear y editar con datos locales; la descripción no es obligatoria, el conteo del límite incluye inactivos y el storefront usa datos semilla.

**HU-007 - Gestionar categorías.** Como propietario, quiero organizar productos por categorías.  
**Aceptación:** las categorías pertenecen a una sola tienda; no se eliminan si tienen productos asociados; pueden desactivarse cuando ya no se usan.

**HU-008 - Controlar inventario.** Como propietario, quiero consultar y ajustar existencias para reflejar mi disponibilidad real.  
**Aceptación:** el stock nunca queda negativo; las alertas informan existencias bajas; una compra confirmada actualiza el inventario. **Estado actual:** existen ajuste y alertas, pero se aceptan valores decimales y las compras no descuentan stock.

**HU-009 - Gestionar pedidos.** Como propietario, quiero consultar y actualizar pedidos para completar las ventas.  
**Aceptación:** solo ve pedidos de sus tiendas; puede revisar cliente, artículos, total y cumplimiento; los estados se muestran de forma ordenada.

**HU-010 - Consultar métricas.** Como propietario, quiero ver ventas, pedidos y productos para evaluar mi operación.  
**Aceptación:** los indicadores corresponden a la tienda seleccionada y no mezclan datos de otras tiendas.

**HU-011 - Gestionar plan.** Como propietario, quiero consultar y cambiar el plan para ajustar el límite de productos a mi negocio.  
**Aceptación:** se muestran precio, límite y beneficios; al alcanzar el límite se ofrece upgrade; los productos existentes se conservan.

### 5.3 Cliente final

**HU-012 - Explorar storefront.** Como cliente, quiero acceder a una tienda por su slug para conocer su catálogo.  
**Aceptación:** una tienda activa puede visitarse sin iniciar sesión; una tienda inexistente o inactiva muestra un error; solo se muestran productos publicados de esa tienda. **Estado actual:** funciona con tiendas semilla conocidas; la validación de tienda inexistente o inactiva y la sincronización con el panel están pendientes.

**HU-013 - Buscar y consultar productos.** Como cliente, quiero filtrar productos y ver su detalle para decidir una compra.  
**Aceptación:** se puede consultar nombre, descripción, precio, categoría y disponibilidad; los filtros no muestran productos de otra tienda.

**HU-014 - Gestionar carrito.** Como cliente, quiero agregar, quitar y modificar cantidades antes de pagar.  
**Aceptación:** el carrito pertenece a una sola tienda; no acepta productos agotados ni cantidades superiores al stock disponible. **Estado actual:** el carrito permite administrar artículos, pero puede conservar artículos de varias tiendas y no valida completamente el stock.

**HU-015 - Completar checkout.** Como cliente, quiero elegir un método de pago y confirmar mi compra.  
**Aceptación:** el pedido exige una cuenta autenticada; se valida disponibilidad; al completar se crea un pedido y se muestra una confirmación. **Estado actual:** exige autenticación y registra un método simulado, pero no valida nuevamente stock ni descuenta inventario.

**HU-016 - Consultar y cancelar pedido.** Como cliente, quiero revisar mis pedidos y cancelar uno pendiente si fue un error.  
**Aceptación:** solo ve sus pedidos; puede consultar estado y detalle; la cancelación solo aparece para pedidos pendientes.

**HU-017 - Consultar seguimiento.** Como cliente, quiero ver el estado y seguimiento de mi pedido para saber cuándo recibirlo.  
**Aceptación:** se muestra el estado actual; si existe envío, se muestran guía y datos disponibles; la ubicación es simulada en el MVP. **Estado actual:** existe un mapa y una simulación local; no existe seguimiento real ni datos disponibles para todos los pedidos.

### 5.4 Administrador de plataforma

**HU-018 - Supervisar plataforma.** Como administrador, quiero consultar usuarios, tiendas y métricas globales para supervisar la operación.  
**Aceptación:** puede distinguir tiendas activas e inactivas, propietarios y clientes; las métricas globales no sustituyen el detalle por tienda. **Estado actual:** el shell administrativo, el dashboard global, la vista de tiendas, la consulta básica de usuarios, la actividad demo y los reportes globales son interactivos con datos locales; la auditoría real y la persistencia aún están pendientes.

**HU-019 - Gestionar planes.** Como administrador, quiero definir planes y límites para administrar la oferta de Mercatus.  
**Aceptación:** puede editar nombre, precio, límite y características; los cambios son visibles para los propietarios. **Estado actual:** la edición visual y el conteo de tiendas por plan son interactivos durante la sesión; todavía no existe persistencia ni administración de suscripciones reales.

## 6. Flujos principales

### 6.0 Primer ingreso y orientación

#### Propietario sin tiendas

1. El propietario inicia sesión y llega al panel de tiendas, no a una pantalla vacía sin explicación.
2. El sistema muestra una bienvenida breve: Mercatus permite crear y administrar tiendas independientes.
3. Se presenta una acción principal: **Crear mi primera tienda**.
4. Una guía indica el orden recomendado: configurar tienda, crear categoría, agregar producto y abrir storefront.
5. El propietario puede omitir la guía, pero siempre puede retomarla desde el panel.
6. Al completar el mínimo, el sistema confirma que la tienda está lista y ofrece **Ver mi tienda**.

**Estado actual:** la pantalla de **Mis Tiendas** ya implementa la bienvenida, la secuencia visual de primeros pasos y el acceso directo a **Crear mi primera tienda**. La guía todavía no registra el avance de cada paso ni muestra una confirmación automática al completar el recorrido.

#### Propietario con tiendas

1. El propietario llega a **Mis tiendas**.
2. Cada tarjeta explica el estado de la tienda y ofrece acciones diferenciadas: entrar al panel, configurar o ver tienda.
3. La acción **Crear tienda** permanece visible para crear otra tienda.
4. Si hay varias tiendas, el sistema indica cuál está seleccionada antes de mostrar productos, inventario o pedidos.

**Estado actual:** el panel global incluye **Inicio**, **Mis Tiendas** y **Crear Tienda**. Dentro de una tienda, la navegación muestra el selector de tienda actual y las secciones **Resumen**, **Pedidos**, **Productos**, **Inventario**, **Categorías**, **Mi Plan**, **Configuración** y **Ver tienda**. El selector permite cambiar directamente entre tiendas propias. **Configuración permanece dentro del contexto de la tienda activa**, por lo que conserva su navegación lateral y vuelve al resumen de esa misma tienda al cancelar o guardar.

#### Cliente Final

1. El cliente entra desde el enlace de una tienda concreta.
2. El storefront explica el nombre de la tienda y qué puede hacer: explorar, comprar o revisar pedidos.
3. El catálogo es la acción principal; carrito y pedidos permanecen accesibles.
4. Si intenta pagar sin cuenta, se explica por qué debe iniciar sesión y se conserva el carrito.

#### Administrador de Plataforma

1. El administrador entra a un panel global identificado como administración de plataforma.
2. La pantalla inicial resume tiendas, usuarios y planes.
3. Cada acción administrativa indica si afecta a toda la plataforma o a una tienda específica.

### 6.1 Registro e inicio de sesión

1. La persona abre registro e informa sus datos.
2. El sistema valida formato, obligatoriedad y unicidad del correo.
3. Se crea la cuenta con el rol permitido para ese flujo.
4. Al iniciar sesión, se validan las credenciales.
5. El usuario llega al espacio correspondiente a su rol: administración, gestión de tiendas o experiencia de cliente.
6. Si falla la validación, permanece en el formulario y recibe una explicación.

### 6.2 Crear y publicar una tienda

1. El propietario selecciona crear tienda.
2. Informa nombre, slug y descripción; el logo es opcional.
3. El sistema verifica que el slug sea válido y único.
4. Se crea la tienda asociada al propietario.
5. El propietario configura identidad, plan y catálogo.
6. El storefront queda disponible mientras la tienda esté activa y tenga productos publicados. **En el frontend actual, la publicación todavía usa datos semilla y no refleja de forma completa los cambios hechos en el panel.**

### 6.3 Registrar un producto

1. El propietario selecciona una tienda y revisa el límite de su plan.
2. Informa los datos mínimos, categoría, precio, stock y tipo de cumplimiento.
3. El sistema valida pertenencia a la tienda, datos obligatorios y stock.
4. Si el límite no fue alcanzado, guarda el producto.
5. El producto puede activarse para aparecer en el storefront.
6. Si hay un error, no se guarda parcialmente y se indica cómo corregirlo.

### 6.4 Compra del cliente

1. El cliente entra al storefront de una tienda activa.
2. Consulta productos disponibles y agrega artículos al carrito.
3. El sistema impide mezclar tiendas o superar existencias.
4. El cliente inicia sesión o crea su cuenta antes de pagar.
5. Selecciona cumplimiento y método de pago simulado.
6. Se valida nuevamente stock y se crea el pedido.
7. El cliente recibe confirmación y puede consultar el estado. **La actualización de inventario y la validación final de disponibilidad todavía deben implementarse.**

### 6.5 Gestión y seguimiento de un pedido

1. El propietario recibe el pedido en la tienda correspondiente.
2. Lo confirma y prepara los artículos.
3. Si corresponde, registra envío y seguimiento; si no, coordina descarga o retiro.
4. El cliente consulta los cambios de estado.
5. Al completar la entrega, el pedido queda entregado.
6. Si permanece pendiente, el cliente puede solicitar cancelación. **Las transiciones completas y el estado “en preparación” aún no están restringidos por un flujo formal.**

## 7. Crítica de claridad y decisiones pendientes

La versión anterior describía capacidades, pero no definía suficientemente la experiencia de entrada. Se identificaron estos riesgos:

1. **Rol ambiguo en el registro:** se mencionaban propietario y cliente, pero no se explicaba qué elige una persona nueva ni qué ocurre si quiere comprar y administrar.
2. **Primer panel sin objetivo:** se definían módulos, pero no el estado inicial de un propietario sin tiendas ni la acción que debe realizar primero.
3. **Cliente sin punto de descubrimiento:** se documentaba el storefront por slug, pero no cómo obtiene el cliente ese enlace ni cómo distingue Mercatus de una tienda individual.
4. **Administrador y propietario poco diferenciados:** ambos podían ver información de tiendas, pero faltaba una señal funcional clara de alcance global versus alcance propio.
5. **Navegación incompleta:** se describían acciones, pero no un mapa de navegación que conectara panel, tienda, storefront, carrito y pedidos.
6. **Promesas mayores que el MVP:** “tiempo real”, “tiendas ilimitadas” y “pago” pueden interpretarse como capacidades reales, aunque el alcance indica simulación o límites dependientes del plan.

Estas observaciones deben tratarse como criterios de claridad, no como detalles opcionales de diseño. Una funcionalidad que existe pero no explica su siguiente paso no cumple completamente el objetivo del MVP.

## 8. Mapa de navegación comprensible

### Visitante

`Landing → Crear mi tienda → Registro → Bienvenida del propietario`

`Landing → Ver tienda demo → Storefront → Producto → Carrito → Checkout → Pedido`

### Propietario

`Bienvenida → Crear tienda → Configuración → Categorías → Productos → Inventario → Ver tienda`

`Mis tiendas → Seleccionar tienda → Inicio / Pedidos / Productos / Inventario / Categorías / Mi plan`

### Cliente Final

`Storefront → Catálogo → Detalle → Carrito → Checkout → Confirmación → Mis pedidos → Seguimiento`

### Administrador

`Panel de plataforma → Tiendas → Usuarios → Planes → Actividad → Reportes`

Cada pantalla debe indicar el contexto actual: **rol**, **tienda seleccionada** y **acción principal recomendada**.

En el panel administrativo, el contexto debe indicar que el alcance es global. Las acciones principales recomendadas son revisar tiendas, consultar usuarios, revisar planes y observar actividad; no crear productos ni gestionar pedidos como si el administrador fuera propietario.

## 9. Estados y decisiones

| Elemento | Estados o valores | Regla principal |
|---|---|---|
| Tienda | Activa / inactiva | Solo las activas se muestran públicamente. |
| Producto | Activo / inactivo | Solo los activos y disponibles pueden venderse. |
| Pedido | Pendiente, confirmado, en preparación, enviado, entregado, cancelado | El cliente solo cancela en pendiente. |
| Cumplimiento | Envío, digital, retiro | Determina la información que se solicita y muestra al cliente. |
| Plan | Gratis, Básico, Pro | Define límite de productos y características disponibles. |

## 10. Matriz de permisos

| Acción | Administrador | Propietario | Cliente |
|---|---:|---:|---:|
| Ver landing, login y registro | Sí | Sí | Sí |
| Crear tienda | No como propietario | Sí | No |
| Configurar sus tiendas | Sí | Sí, solo propias | No |
| Ver todas las tiendas | Sí | No, solo propias | No |
| Gestionar productos y categorías | Sí, con contexto | Sí, solo propias | No |
| Gestionar inventario | Sí, con contexto | Sí, solo propias | No |
| Comprar | No como función administrativa | Sí como cliente si tiene cuenta | Sí |
| Gestionar pedidos de una tienda | Sí, con contexto | Sí, solo propias | No |
| Consultar sus pedidos | No como función administrativa | Sí si compra | Sí |
| Cambiar su plan | No | Sí | No |
| Definir planes de plataforma | Sí | No | No |

## 11. Errores y casos alternos

- **Correo usado:** se rechaza el registro y se solicita otro correo.
- **Credenciales inválidas:** no se crea sesión y se muestra un mensaje claro.
- **Slug repetido:** no se crea la tienda hasta elegir un identificador disponible.
- **Tienda inactiva o inexistente:** se muestra una página de no disponibilidad.
- **Límite del plan alcanzado:** se bloquea el alta y se presenta la opción de upgrade.
- **Stock insuficiente:** se impide confirmar el pedido y se actualiza la disponibilidad mostrada.
- **Carrito de otra tienda:** se solicita vaciar o completar el carrito anterior antes de continuar.
- **Acceso no autorizado:** se bloquea la acción y se redirige al espacio permitido.
- **Categoría con productos:** no se elimina; se solicita desactivar o reasignar.
- **Cancelación tardía:** un pedido que ya no está pendiente no puede cancelarse desde el storefront.

## 12. Alcance del MVP y evolución

El MVP debe demostrar un ciclo completo: un propietario crea una tienda, publica productos, recibe una compra simulada y gestiona el pedido; un cliente navega, compra y consulta el resultado; un administrador supervisa usuarios, tiendas y planes sin romper el aislamiento.

Las siguientes capacidades pueden incorporarse después: pagos reales, impuestos, facturación oficial, integraciones logísticas, dominios personalizados activos, notificaciones externas, reportes avanzados, promociones, reseñas, múltiples almacenes, marketplace y aplicaciones móviles.

## 13. Trazabilidad funcional

| Área | Requisitos del informe | Reglas | Historias de este documento |
|---|---|---|---|
| Autenticación | RF-001 a RF-006 | 1-7 | HU-001 a HU-003 |
| Catálogo | RF-007 a RF-013 | 16-24 | HU-006 y HU-007 |
| Inventario | RF-014 y RF-015 | 18-19, 25 | HU-008 |
| Pedidos | RF-016 a RF-018 | 26-35 | HU-009, HU-014 a HU-017 |
| Tiendas | RF-021 a RF-024 | 8-15 | HU-004, HU-005 y HU-010 |
| Landing pública | RF-025 y RF-026 | 4-5 | Visitante y acceso público |
| Planes | HU-029 y HU-030 del informe | 36-39 | HU-011 y HU-019 |
| Administración | RF-006, RF-019 y RF-020 | 7, 40 y §4.6 | HU-018 y HU-019 |
| Orientación inicial | Extensión funcional de RF-025/RF-026 | 4-5 | HU-000, HU-000A y HU-000B |
