# Training App: bitácora de uso de IA y diario de decisiones

**Proyecto:** Training App, app móvil donde un instructor crea y asigna rutinas a sus clientes
**Materia:** Aplicaciones Móviles, 7.º semestre (proyecto final)
**Autor:** Rodrigo López Rojas
**Repositorio:** https://github.com/RodrigoLRGH/AM_TrainingApp
**Herramientas de IA:**
- Claude (Anthropic), en una conversación continua de planeación, backend y app (1 de septiembre al 19 de noviembre).
- Claude Code (Anthropic), extensión de VS Code con acceso al repositorio, en una sesión del 20 al 22 de noviembre.

**Periodo cubierto:** 1 de septiembre al 22 de noviembre de 2026
**Fuentes de este documento:**
- La conversación con Claude. Una parte se reconstruyó desde un resumen.
- La sesión de Claude Code del 20 al 22 de noviembre.
- Los 47 commits del repositorio hasta `5dd6f75`.

> **Cómo leer este documento.** Cada afirmación lleva su evidencia:
> - *conversación*: salió del chat con Claude;
> - *sesión*: salió de la sesión de Claude Code (20 al 22 de noviembre);
> - *commit*: solo está en el historial de Git.
>
> Lo que aparece solo en commits, entre el 7 y el 19 de noviembre, no se puede atribuir a la IA ni al autor desde el chat. Está marcado como **sin registro en la conversación**.

---

## Parte 1. Bitácora de uso de la IA

### 1.1 Resumen

| Aspecto | Detalle |
|---|---|
| Rol de la IA (conversación, sep a nov) | Asesor de diseño y generador de código por pasos. Entregaba el código y los comandos, y el autor los pegaba, ejecutaba y probaba. |
| Rol de la IA (sesión del 20 al 22 nov) | Agente con acceso al repositorio. Leía el código, diagnosticaba, editaba los archivos directamente y ejecutaba revisiones (`tsc`, lint, compilación del backend y simulaciones). También proponía el texto de cada commit. |
| Rol del autor | Decidir alcance y estilo, ejecutar y probar en dispositivo real, reportar errores (en la sesión del 20 nov, con capturas del iPhone) y hacer los commits. En la conversación, además, creaba los archivos y confirmaba cada paso. |
| Qué generó la IA | Documentos de requisitos, plan de trabajo, backend completo, la app en Expo, scripts de prueba, correcciones de errores, los ajustes de diseño, validación y manejo de errores del 20 de noviembre, el README y la preparación para casos límite (21 y 22 de noviembre). |
| Qué no pudo hacer la IA | Probar en el teléfono del autor, ver su red local ni entrar a Render o Neon. Todo lo que dependía de ello lo verificó el autor o quedó pendiente. |
| Atribución en el repo | Ningún commit tiene línea `Co-Authored-By`; los 47 aparecen a nombre del autor, incluidos los 12 de la sesión del 20 al 22 de noviembre. Los archivos `AGENTS.md` y `CLAUDE.md` de `training-app-mobile` los trajo la plantilla de Expo (commit `782c146`), no los escribió el autor. |

### 1.2 Cronología de uso

Las fechas de la fase 1 salen de las marcas de tiempo de los archivos adjuntos a la conversación. Las demás salen de los commits correspondientes. La fecha exacta de cada mensaje no se conserva.

| # | Fecha aprox. | Etapa | Qué se pidió a la IA | Qué produjo la IA | Qué hizo el autor | Evidencia |
|---|---|---|---|---|---|---|
| B-01 | 1 sep | Viabilidad e ideas | "¿Se puede hacer un app de rutinas con instructor y clientes? ¿Qué tan complicado?", "¿habrá roles?", "alguna idea diferente" | Análisis de viabilidad, roles y propuestas (asistencia por ubicación, mapas para running, alternativas de ejercicios) | Eligió qué ideas conservar | Conversación |
| B-02 | 1 sep | Documento de requisitos | Documento detallado de la idea para el proyecto final | Documento Word con RF, RNF y RU numerados | Revisó, pidió correcciones ("completo y corregido") y lo reenvió varias veces para validar | Conversación |
| B-03 | 1 sep | Preguntas técnicas de Expo | Segundo plano para running, notificaciones, qué se puede hacer con Expo, ideas con QR | Explicaciones de límites de Expo Go y opciones. El QR quedó como identificador del gimnasio. | Decidió usar running en primer plano y notificaciones push | Conversación |
| B-04 | 1 sep | Nuevas funciones | Más ideas: medición de progreso físico, calificación de sesión, reutilizar rutinas, estadísticas del instructor | Integración de las 4 funciones en roles, navegación y requisitos | Descartó "ejercicios alternativos" | Conversación |
| B-05 | 1 sep | Plan de trabajo | "Plan de qué y en qué orden" | Plan por fases (backend primero, luego app) | Siguió el orden propuesto | Conversación |
| B-06 | 13 sep | Entorno del backend | Backend + auth paso a paso con NestJS y Prisma | Guía de instalación, estructura y dependencias | Resolvió Docker, DBeaver y Postgres con ayuda de la IA para diagnosticar | Conversación + commits `a99f128`, `1edfc82`, `3468309` |
| B-07 | 13 sep | Auth y clientes | Registro y login de instructor, login de cliente por código, CRUD de clientes | Módulos `auth` y `clients`, guards, decoradores, DTOs | Pegó el código, corrigió errores de compilación guiado por la IA | Conversación + commit `3468309` |
| B-08 | 20 sep | Rutinas, asistencia y running (backend) | Fases 2 a 5 | Módulos `routines`, `attendance` (geo + QR) y `running`, con pruebas en PowerShell | Ejecutó las pruebas y reportó resultados | Conversación + commits `1d95d65`, `a1cb358`, `a8ebc37` |
| B-09 | 27 sep | Progreso, push y estadísticas (backend) | Fases 6 y 7 | Módulos `measurements`, `session-ratings`, `push`, `announcements`, `stats` y el script `test-all.ps1` | Corrió las pruebas de punta a punta ("todo bien") | Conversación + commits `2ce0fa4`, `feb177b`, `e2a9925`, `081299f` |
| B-10 | 1 oct | Arranque de la app | Pasar a Expo: plantilla con Expo Router, estructura `app/`, login real, elección de librería de UI | Estructura de grupos `(auth)`, `(instructor)`, `(client)`, cliente axios y contexto de autenticación | Creó el proyecto, eligió React Native Paper, estableció sus reglas de estilo | Conversación + commits `782c146`, `800e9f9` |
| B-11 | 5 a 9 oct | Refactor a hook + componentes | Pasar login, rutina del cliente, clientes y plantillas al patrón hook + componentes | Hooks `use*`, componentes y pantallas delgadas | Revisó la apariencia y pidió ajustes visuales uno por uno | Conversación + commits `6395c92`, `f13875e`, `cfaf134` |
| B-12 | 14 a 21 oct | Asistencia, running, progreso, calificación | Pantallas de cliente e instructor para cada función | Escáner QR, `useCheckin`, mapa con `react-native-maps`, gráficas con SVG, modales de medición y calificación | Probó en iPhone y reportó fallos | Conversación + commits `dd0d8ee`, `018b712`, `c7d7cdd`, `0250487`, `323c83b`, `48559ff` |
| B-13 | 24 oct | SDK 58 y pantallas completas | Compatibilidad con Expo Go de iOS y cambio de modales a pantallas | Procedimiento de upgrade con `--legacy-peer-deps`, `DateField`, formularios en pantalla | Ejecutó el upgrade y resolvió el conflicto `ERESOLVE` | Conversación + commits `20df981`, `623b220`, `5db75cd` |
| B-14 | 25 oct | Sesión, push y desactivación | Sesión persistente, cerrar sesión, registro de instructor, push con navegación y avisos, activar y desactivar clientes | `SecureStore`, manejo del 401, `NotificationObserver`, campana de avisos, validación del cliente activo en cada petición | Probó el push en iPhone ("sí funcionó") y la desactivación ("ya funcionó") | Conversación + commits `a14e8d5`, `9e0ea4b`, `fd42242` |
| B-15 | 25 oct | Modo offline | Marcar ejercicios sin conexión y sincronizar después | Cola en AsyncStorage, `SyncContext`, banner de sincronización | Probó y confirmó ("ya hice todo y el commit") | Conversación + commit `38c5b3d` |
| B-16 | hacia el 7 nov | Asistencia automática (RF-09) | Registrar la asistencia al abrir la app dentro del gimnasio | `useAutoCheckin`, `AutoCheckinHost`, cambio de texto en `CheckinCard` y pasos de prueba | Integró el código. En la conversación **no consta** que haya confirmado la prueba. | Conversación + commit `8ad6454` |
| B-17 | 7 nov | Sustituir `Alert` por componente | **Sin registro en la conversación** | — | — | Commits `8ad6454`, `7b2d7d4` |
| B-18 | 8 nov | Editar y eliminar rutinas, ajuste de ejercicios por cliente (RF-26), validación | **Sin registro en la conversación** | — | — | Commit `ff9f25f` |
| B-19 | 17 a 19 nov | Paleta, historial de rutas, dependencias, EAS | **Sin registro en la conversación** | — | — | Commits `6024c66`, `60e290e`, `e023320` |
| B-20 | 19 nov | Primera versión de esta bitácora | Bitácora de uso de IA y diario de decisiones a partir de la conversación y los commits | Primera versión de este documento | Revisar y ajustar (ver 1.6) | Conversación |
| B-21 | 20 nov | Pruebas con la base local | Conectarse al Postgres local en lugar de Neon y revisar si quedó bien | Encontró el contenedor `nest_prisma_db` y la base `training_app` con las tablas ya creadas. Diagnosticó que la contraseña del `.env` no era la del contenedor, sin mostrarla. | Corrigió la contraseña ("ya funcionó") | Sesión |
| B-22 | 20 nov | Confirmar cambio de ubicación del gimnasio | Modal de confirmación para no cambiar la ubicación sin querer | Confirmación con `AppAlert` antes de pedir el GPS; el texto cambia si ya había ubicación | Hizo el commit | Sesión + commit `47a828b` |
| B-23 | 20 nov | Teclado en modales y nombres largos | No se podía salir de un input tocando afuera; los nombres de ejercicio largos se salían del campo | Componente común `FormModal` y campo de nombre multilínea | Reportó ambos fallos con capturas e hizo el commit | Sesión + commit `baa0e7e` |
| B-24 | 20 nov | Ajustes visuales de modales | Espacio sobrante en el modal de medición, botón para cerrarlo, selector de esfuerzo desbordado | Altura del modal en píxeles, botón Cancelar, botones de esfuerzo sin ancho mínimo | Reportó los fallos con capturas | Sesión + commit `73dc6e6` |
| B-25 | 20 nov | Calificaciones con nombre de la sesión | Que el instructor vea el nombre de la rutina calificada y que las filas tengan más estilo | El endpoint agrega `routineTitle` sin cambiar el esquema; rediseño de `RatingRow` | Hizo el commit, junto con B-24 | Sesión + commit `73dc6e6` |
| B-26 | 20 nov | Botón de regresar | El botón decía "(instructor)" o "(client)" | Explicación de por qué (grupos de Expo Router sin título) y `headerBackButtonDisplayMode: 'minimal'` | Hizo el commit | Sesión + commit `4dc78d1` |
| B-27 | 20 nov | Límites de datos | Primero solo la opinión ("no hagas cambios, solo dime"), luego "aplica los cambios" | Análisis de qué datos no tenían máximo, tabla de límites sugeridos y su aplicación en backend y app | Aprobó los límites y pidió quitar el de clientes por asignación | Sesión + commit `e4125bd` |
| B-28 | 20 nov | Corrida sin wifi con backend local | Si una corrida funciona al alejarse del wifi | Explicación de qué pasa en cada paso, el problema de que el regreso se sume a la corrida, y opciones de prueba (túnel o producción) | — (consulta sin cambios de código) | Sesión |
| B-29 | 20 nov | Sincronización al marcar rápido | Si el error al marcar ejercicios rápido con Render y Neon se arreglaría con Azure | Diagnóstico: el fallo estaba en la cola de la app, no en el hosting. Corrección y simulación del escenario. | Aprobó el arreglo ("sí") e hizo el commit | Sesión + commit `533779d` |
| B-30 | 20 nov | Despliegue | Cómo llevar los cambios a Render y Neon | Revisión del repositorio: Neon sin cambios de esquema, Render por auto-deploy, `eas update` para la app y advertencia sobre el `.env` | — (consulta sin cambios de código) | Sesión |
| B-31 | 20 nov | Errores de axios sin conexión | Errores de axios como instructor en modo avión | Estado "Sin conexión" con botón Reintentar en 8 pantallas, sin `console.error` | Hizo el commit | Sesión + commit `ce54f1f` |
| B-32 | 20 nov | Filtro de clientes en Asistencia | La fila de filtros ocupaba media pantalla | `flexGrow: 0` y `alignItems: 'center'` en `ClientFilterChips` | Reportó con captura. En el commit quitó los comentarios del código. | Sesión + commit `de44aed` |
| B-33 | 20 nov | Tarjetas de estadísticas | "Un componente encima de otro" en Clientes activos | `StatCard` con una `View` en lugar del `Card` de Paper | Reportó con captura e hizo el commit | Sesión + commit `9446495` |
| B-34 | 21 nov | Actualización de esta bitácora | Agregar lo hecho en la sesión del 20 de noviembre | Segunda versión de este documento | La revisó, eliminó la parte de pendientes e hizo el commit | Sesión + commit `212445b` |
| B-35 | 21 nov | README | "Tenía este README, ¿está bien? Aplícalo y haz los cambios que creas necesarios" | Comparación del README con el código (rutas, variables de entorno, carpetas y scripts) y versión corregida | Hizo el commit, junto con la bitácora | Sesión + commit `212445b` |
| B-36 | 21 nov | Auditoría de casos límite | Revisar si el proyecto cumple 9 casos límite: modo avión, campos vacíos, texto o negativo en números, texto largo, doble toque, girar el celular, salir y volver, negar permisos y listas vacías. "No hagas cambios aún". | Revisión caso por caso: 6 se cumplían y 3 de forma parcial (doble toque, salir y volver, permisos negados). Lista de 4 arreglos en orden de importancia. | Eligió aplicar solo los arreglos 1, 2 y 3 | Sesión |
| B-37 | 22 nov | Arreglos de casos límite | Aplicar los arreglos 1, 2 y 3 | Botón "Abrir ajustes" para permisos negados, candados contra doble toque, y corrida guardada en el teléfono para continuarla o terminarla al volver | Hizo el commit | Sesión + commit `876d315` |
| B-38 | 22 nov | Actualización de esta bitácora | Agregar los días 21 y 22 de noviembre | Tercera versión de este documento | Hizo el commit | Sesión + commit `5dd6f75` |
| B-39 | 22 nov | Publicación | Cómo aplicar los cambios a las ligas de Android e iOS, y si siempre habrá una liga nueva | Revisión de builds, actualizaciones y canales en EAS. Las ligas de Expo Go apuntan a una actualización específica. | Publicó la actualización en la rama `main` | Sesión |
| B-40 | 22 nov | Revisión contra requisitos y entrega | Si ya cumplía con el PDF de requisitos, los entregables de Classroom y los casos límite | Comparación con el código. Faltantes: lista de mediciones (RF-19) y grupo muscular (4.2). Diferencias del PDF: RU-02, SDK, gráficas y pestañas. RNF-01 y RNF-02 sin medir. | Decidió no hacer APK y no pidió a la IA actualizar el PDF | Sesión |
| B-41 | 22 nov | Cambios finales | Hacer los cambios del proyecto, sin tocar el PDF | Historial de mediciones para el instructor, README con la publicación real y esta actualización | Revisar, probar en dispositivo y hacer el commit | Sesión |

### 1.3 Tipos de ayuda recibida

- **Planeación y análisis:** viabilidad, ideas de funciones, plan por fases, comparación de librerías y tecnologías.
- **Redacción:** documento de requisitos con numeración RF, RNF y RU, y esta bitácora.
- **Generación de código:**
  - backend completo con 6 fases de módulos;
  - app en Expo con hooks y componentes;
  - scripts de prueba en PowerShell.
- **Depuración:**
  - errores de entorno: Docker, Postgres, Prisma, Node 24, firewall e IP local, y contraseña de la base local;
  - errores de TypeScript y de Metro;
  - errores de ejecución en iOS;
  - conflictos de dependencias;
  - en la sesión del 20 de noviembre, errores de diseño a partir de capturas: modales, tarjetas, filtros y botón de regresar.
- **Diagnóstico antes de cambiar nada (sesión del 20 nov):**
  - con base local, si una corrida funciona sin wifi;
  - qué datos no tenían límites;
  - si cambiar a Azure resolvía el error de sincronización;
  - cómo desplegar;
  - si el proyecto cumplía 9 casos límite (21 nov);
  - si cumplía el PDF de requisitos y los entregables (22 nov).

  En estas preguntas la IA primero explicó la causa; el autor decidía si aplicar el cambio.
- **Revisión y ajuste visual:** el autor describía lo que no le gustaba, o mandaba una captura, y la IA reescribía el componente.
- **Verificación automática (sesión del 20 nov):** la IA ejecutó `tsc --noEmit` y el lint después de cada cambio. Para los límites y para la hora de término de una corrida compiló el backend y probó los DTOs; para la cola de sincronización hizo una simulación.

### 1.4 Errores y limitaciones de la IA, y cómo se corrigieron

| Problema | Origen | Cómo se resolvió |
|---|---|---|
| Se usaron constantes de color fijas (verde) en el listado de clientes, en lugar del tema lila de Paper | Error de la IA, señalado por el autor | Rehacer `ClientCard` y compañía con `useTheme` |
| Código con `as const` y `position: absolute` | Contra la preferencia declarada del autor | El autor fijó la regla y la IA la aplicó desde entonces |
| `tabBarIcon` daba error de tipo (`ColorValue`) en SDK 58 | Versión de la API distinta a la que la IA conocía | Función `tabIcon()` con comprobación `typeof color === 'string'` |
| Al vencer el token se veía el error crudo de axios | Fallo de diseño del interceptor | El interceptor devuelve una promesa pendiente y el handler corre una sola vez |
| Encabezados transparentes en iOS 26 con SDK 58 | Cambio de comportamiento de la plataforma | `headerTransparent: false` |
| Prisma 7 y 8 rompían `schema.prisma` y `prisma init` fallaba con Node 24 | Versión nueva e incompatible con la guía | Fijar Prisma 5.22.0 y crear `schema.prisma` y `.env` a mano |
| `Cannot find name 'dto'` en `routines.service.ts` | Bloque de código pegado dentro del método equivocado | La IA entregó ambos métodos completos |
| `setUnauthorizedHandler is not a function` | Interceptor pegado en `clients.ts` en lugar de `client.ts` | La IA entregó ambos archivos limpios |
| `SelectRow undefined` y `Unable to resolve useNewTemplate` | Archivo vacío o en carpeta equivocada al armar el proyecto a mano | Pegar el código completo y mover `new-template.tsx` a `src/app/` |
| Se desactivó el cliente equivocado en una prueba | Había dos clientes llamados "María Cliente" | Se aclaró con los ids y códigos (WX9CEL y 8RXHX5) |
| La IP del equipo cambiaba entre redes y el firewall bloqueaba la conexión | Entorno del autor, que la IA no podía ver | Resolución automática de IP con `hostUri`, con `.env` como respaldo, y timeout |
| Al correr `npx expo lint` se instalaron `eslint` y `eslint-config-expo` y se creó `eslint.config.js` sin que el autor lo pidiera *(20 nov)* | Efecto secundario del comando: el proyecto no tenía ESLint configurado | La IA lo informó en ese mismo turno y recomendó conservarlo. El autor lo incluyó en el commit `47a828b`. |
| El primer intento de `FormModal` dejaba espacio sobrante debajo del botón Guardar *(20 nov)* | El `Surface` de Paper centra su contenido y el `maxHeight: '85%'` no se calculaba bien | Contenido alineado arriba y altura máxima en píxeles (commit `73dc6e6`) |
| Prettier formateó un archivo con comillas dobles y 2 espacios *(20 nov)* | La IA lo ejecutó sin la configuración del proyecto | Se volvió a formatear con comillas simples y 4 espacios antes del commit |
| Un script de edición convirtió `\n` de una expresión regular en un salto de línea real *(20 nov)* | Error de escape de la IA al editar con Python | `tsc` lo detectó y la IA lo corrigió antes de entregar |
| Un script de edición se detuvo a la mitad por una sangría que no coincidía *(20 nov)* | El archivo había cambiado de formato en un paso anterior | La IA terminó a mano las 2 ediciones que faltaban y volvió a revisar con `tsc` |
| El mensaje "máximo 72 caracteres" de la contraseña era engañoso con acentos *(20 nov)* | El límite de bcrypt es en bytes, no en caracteres | La IA lo detectó en su propia prueba y cambió el mensaje a "La contraseña es demasiado larga." |
| `tsc` y el lint de la app se ejecutaron en la carpeta del backend *(22 nov)* | La IA asumió la carpeta de trabajo equivocada. `npx expo lint` respondió con un error de la versión antigua de expo-cli. | La IA lo notó por ese error y repitió las revisiones con la ruta completa de la app |
| La primera versión de "Terminar" una corrida recuperada podía dejarla guardada para siempre *(22 nov)* | Si el servidor rechazaba los puntos (por ejemplo, porque la corrida ya estaba terminada), se volvía a guardar para reintentar | La IA lo detectó al revisar su propio código antes de entregar: un rechazo del servidor ahora borra la corrida guardada |
| La IA recomendó publicar con `--channel preview` y lo escribió en el README *(21 nov)* | Asumió que había builds escuchando canales, sin revisar EAS. Solo había un APK sin `expo-updates` y ningún canal. | Al revisar EAS el 22 de noviembre lo informó y corrigió el README a `--branch main` |
| La IA sugirió compilar un APK nuevo sin revisar todo lo que necesitaba *(22 nov)* | `.env` no se sube a EAS, y faltan la clave de Google Maps y las credenciales de FCM | Lo corrigió en la revisión contra requisitos. El autor decidió no hacer APK (D-44). |

**Lección general:**
- En la conversación, los errores casi siempre aparecían al armar el proyecto a mano a partir del código por pasos: archivos faltantes, rutas equivocadas o código pegado en otro lugar. Por eso se planteó correr `npx tsc --noEmit` como primera revisión. La conversación no registra el resultado de esa revisión.
- En la sesión del 20 de noviembre, la IA editó los archivos directamente y corrió `tsc` y el lint después de cada cambio. Ese tipo de error desapareció. Los errores que quedaron fueron de la propia IA, de herramientas o de formato, y los detectaron las mismas revisiones.

### 1.5 Verificación del trabajo generado

| Qué | Cómo se verificó | Resultado |
|---|---|---|
| Backend (fases 1 a 7) | `test-all.ps1` con registro, login, clientes, rutinas, asistencia, running, mediciones, calificación, avisos y dashboard | "Todo bien" (conversación) |
| Push de punta a punta | Instructor crea aviso o asigna rutina y el iPhone recibe la notificación | "Sí funcionó" (conversación) |
| Desactivar cliente (RF-08) | Desactivar y comprobar que pierde acceso en la siguiente petición | "Ya funcionó" (conversación) |
| Modo offline | Marcar ejercicios sin red y sincronizar al volver | Confirmado por el autor (conversación) |
| Asistencia automática (RF-09) | Pasos de prueba entregados | **Sin confirmación en la conversación** (el código está en el commit `8ad6454`) |
| Running, progreso y estadísticas en la app | Pasada de pruebas planeada | **Sin confirmar**. Hay commits posteriores en running (`60e290e`), pero no hay registro de la prueba. |
| Conexión a la base local (20 nov) | `prisma migrate status` con la contraseña del contenedor | Funciona; el autor confirmó "ya funcionó" |
| Límites de datos en el backend (20 nov) | La IA compiló el backend y validó los DTOs con datos dentro y fuera de rango | Rechaza los datos inválidos con el mensaje correcto y acepta los válidos |
| Cola de sincronización (20 nov) | Simulación con el código real de la cola y un servidor falso con 300 ms de retraso: marcar rápido, marcar y desmarcar, y servidor caído | Los 3 escenarios se comportaron como se esperaba |
| Cambios de interfaz del 20 nov (modales, calificaciones, botón de regresar, filtros, tarjetas, estado sin conexión) | `tsc --noEmit` y lint en cada cambio | Sin errores nuevos. **La IA no los probó en un dispositivo**, y en la sesión no consta que el autor confirmara cada uno en el iPhone. |
| Hora de término de una corrida (22 nov) | La IA compiló el backend, validó el nuevo campo `endedAt` y probó que la hora se limita entre el inicio y la hora actual | Acepta la petición sin el campo y con una fecha válida, rechaza una fecha inválida y limita las horas fuera de rango |
| Casos límite: permisos, doble toque y corrida interrumpida (22 nov) | `tsc --noEmit` y lint en la app y el backend; la IA dejó pasos de prueba para el iPhone | Sin errores nuevos. **No probado en un dispositivo**; en la sesión no consta la prueba del autor. |
| Historial de mediciones del instructor, RF-19 (22 nov) | `tsc --noEmit` y lint | Sin errores. **No probado en un dispositivo.** |
| Liga de Expo en un celular ajeno (22 nov) | No verificado por la IA | **Pendiente.** Es la vía de entrega (D-44), así que debe probarse en iOS y Android antes de entregar. |
| Despliegue en Render (20 al 22 nov) | No verificado por la IA (no tiene acceso al dashboard) | Pendiente de que el autor confirme el deploy del commit más reciente. Hasta entonces, una corrida recuperada cuenta también el tiempo que la app estuvo cerrada (D-42). |
| Rendimiento (RNF-01 y RNF-02) | No medido | Pendiente |
| Usabilidad (RU-01) | Probado solo en iPhone | Pendiente en otras plataformas |

### 1.6 Responsabilidad y transparencia

- La IA propuso y escribió buena parte del código. Hasta el 19 de noviembre, el autor lo integraba a mano. En la sesión del 20 al 22 de noviembre, la IA editó los archivos directamente y el autor revisó, probó en su iPhone y decidió qué subir en cada commit. Esa división está documentada en 1.2.
- Las decisiones de alcance, estilo y diseño de la sección 2 las tomó el autor. En cada una se indica quién propuso la opción.
- La IA no hizo commits ni despliegues. Propuso el texto de los commits, y el autor los ejecutó y a veces los ajustó, por ejemplo uniendo dos commits sugeridos en `73dc6e6`.
- **Antes de entregar, el autor debe revisar y completar:**
  1. Las entradas B-17, B-18 y B-19, que no constan en el chat, para declarar si hubo o no apoyo de IA.
  2. Si probó en el iPhone los cambios de B-22 a B-33, B-37 y B-41, para cambiar "sin confirmar" por el resultado en 1.5.
  3. Si la materia exige una declaración de uso de IA en un formato específico, ajustar este documento a ese formato.
  4. Si quiere atribución en Git, añadir `Co-Authored-By` en commits futuros. Los pasados no la tienen.
- Este documento no sustituye los registros originales. Es una reconstrucción hecha a partir de un resumen de la conversación, de la sesión del 20 al 22 de noviembre y del historial del repositorio.

---

## Parte 2. Diario de decisiones

Formato: **Decisión, contexto, opciones, elección, razón, consecuencias, quién decidió.**
El campo "Evidencia" indica dónde consta cada decisión.

### Índice

| ID | Decisión | Fecha aprox. |
|---|---|---|
| D-01 | Alcance: instructor y cliente con roles | 1 sep |
| D-02 | Funciones diferenciadoras y descartes | 1 sep |
| D-03 | Running y asistencia en primer plano | 1 sep, 25 oct |
| D-04 | Stack del backend | 13 sep |
| D-05 | PostgreSQL en el contenedor Docker existente | 13 sep |
| D-06 | Prisma 5.22 fijado y esquema escrito a mano | 13 sep |
| D-07 | Autenticación por rol: correo y contraseña o código de 6 caracteres | 13 sep |
| D-08 | `prisma db push` en lugar de migraciones | 13 a 20 sep |
| D-09 | Backend por fases con script de pruebas | 13 a 27 sep |
| D-10 | Estructura de la app con Expo Router y grupos por rol | 1 oct |
| D-11 | React Native Paper como librería de UI | 1 oct |
| D-12 | Arquitectura hook + componentes y reglas de estilo | 1 a 5 oct |
| D-13 | Pantallas completas en lugar de modales | 24 oct |
| D-14 | Subir a Expo SDK 58 | 24 oct |
| D-15 | Resolver la IP del backend automáticamente | oct |
| D-16 | Gráficas con `react-native-svg` | 21 oct |
| D-17 | Notificaciones push con `expo-notifications` | 25 oct |
| D-18 | Cliente desactivado se valida en cada petición | 25 oct |
| D-19 | Sesión vencida: cerrar una sola vez y sin mostrar error | 25 oct |
| D-20 | Modo offline limitado a marcar ejercicios | 25 oct |
| D-21 | Una sola calificación por sesión | 21 oct |
| D-22 | Asistencia automática solo con la app abierta | oct a nov |
| D-23 | Reemplazar `Alert` por un componente propio | 7 nov |
| D-24 | Validación global y ajuste de ejercicios por cliente (RF-26) | 8 nov |
| D-25 | Paleta neutra en lugar del lila | 17 nov |
| D-26 | Preparar builds con EAS | 19 nov |
| D-27 | Base local para pruebas y Neon para producción | 20 nov |
| D-28 | Confirmar antes de cambiar la ubicación del gimnasio | 20 nov |
| D-29 | Modal común para formularios (`FormModal`) | 20 nov |
| D-30 | Nombre de ejercicio en varias líneas | 20 nov |
| D-31 | Nombre de la sesión en calificaciones sin cambiar el esquema | 20 nov |
| D-32 | Calificaciones en escala de grises según el esfuerzo | 20 nov |
| D-33 | Botón de regresar sin texto | 20 nov |
| D-34 | Límites de longitud y rango en backend y app | 20 nov |
| D-35 | Corregir la sincronización en la app en lugar de cambiar de hosting | 20 nov |
| D-36 | Estado "Sin conexión" con Reintentar en lugar de `console.error` | 20 nov |
| D-37 | Tarjetas de estadísticas con `View` en lugar del `Card` de Paper | 20 nov |
| D-38 | Conservar ESLint en la app | 20 nov |
| D-39 | Publicar actualizaciones con `--channel` en lugar de `--auto` | 21 nov |
| D-40 | Ofrecer "Abrir ajustes" cuando un permiso quedó negado | 22 nov |
| D-41 | Candados contra doble toque en `AppAlert` y en la corrida | 22 nov |
| D-42 | Guardar la corrida en curso para continuarla o terminarla | 22 nov |
| D-43 | Casos límite que se dejaron como están | 22 nov |
| D-44 | Entregar por liga de Expo Go, sin APK | 22 nov |
| D-45 | Historial de mediciones para el instructor (RF-19) | 22 nov |

---

### D-01. Alcance: instructor y cliente con roles
- **Contexto:** idea inicial de un app de rutinas en la que un instructor asigna rutinas a clientes.
- **Opciones:** app individual sin roles, o app con instructor y cliente.
- **Elección:** dos roles (instructor y cliente), cada uno con su propia navegación.
- **Razón:** la IA señaló que era viable y de complejidad media, y el autor quería un caso de uso con dos tipos de usuario.
- **Consecuencias:** autenticación diferenciada, guards por rol en el backend y grupos de rutas por rol en la app.
- **Quién decidió:** el autor, tras el análisis de la IA.
- **Evidencia:** conversación.

### D-02. Funciones diferenciadoras y descartes
- **Contexto:** el autor buscaba algo distinto de una app de rutinas común. Había propuesto ejercicios alternativos, ubicación, asistencia y mapas para correr.
- **Opciones:** conservar todas las ideas, o recortar alcance.
- **Elección:**
  - Se conservan: asistencia (geolocalización y QR), running con mapa, mediciones físicas con gráfica, calificación de sesión, reutilizar plantillas y estadísticas del instructor.
  - **Se descartan los ejercicios alternativos.**
- **Razón:** el autor pidió explícitamente no hacerlos ("no voy a poner los ejercicios alternativos"). La IA integró el cambio en el documento de requisitos.
- **Consecuencias:** menos complejidad en el modelo de ejercicios, y más tiempo para asistencia y running.
- **Quién decidió:** el autor.
- **Evidencia:** conversación.

### D-03. Running y asistencia en primer plano
- **Contexto:** el autor creía importante que la app corriera en segundo plano para registrar carreras. Luego preguntó si funcionaría igual en primer plano.
- **Opciones:** ubicación en segundo plano (requiere un build propio y el permiso "Siempre"), o solo en primer plano.
- **Elección:** primer plano, tanto para running como para la asistencia automática.
- **Razón:** Expo Go no soporta el segundo plano; el requisito original decía "al abrir la app".
- **Consecuencias:** el running registra solo con la pantalla activa, y la asistencia automática se revisa al abrir, al volver y cada 5 minutos con la app abierta. Con la app cerrada no se registra nada.
- **Quién decidió:** el autor, con las limitaciones explicadas por la IA.
- **Evidencia:** conversación.

### D-04. Stack del backend: NestJS, Prisma y PostgreSQL
- **Contexto:** el autor ya había usado NestJS y Prisma en otro proyecto.
- **Opciones:** NestJS + Prisma, u otras alternativas (se preguntó por pnpm y por otras formas de armar el backend tras los problemas de instalación).
- **Elección:** NestJS 10, Prisma y PostgreSQL.
- **Razón:** familiaridad previa y estructura modular que encaja con las fases del plan.
- **Consecuencias:** un módulo por área (`auth`, `clients`, `routines`, `attendance`, `running`, `tracking`, `push`, `announcements`, `stats`).
- **Quién decidió:** el autor.
- **Evidencia:** conversación + commit `a99f128`.

### D-05. PostgreSQL en el contenedor Docker existente
- **Contexto:** `psql` no estaba reconocido y Postgres no estaba instalado localmente. El autor ya tenía un contenedor.
- **Opciones:** instalar Postgres en Windows, o usar el contenedor `nest_prisma_db`.
- **Elección:** usar el contenedor, administrado con DBeaver.
- **Razón:** evita instalar nada y reutiliza lo que ya tenía el autor.
- **Consecuencias:** Docker debe estar abierto para que el backend conecte. Hubo que activar "Show all databases" en DBeaver para ver `training_app`.
- **Quién decidió:** el autor, a partir del diagnóstico de la IA.
- **Evidencia:** conversación.

### D-06. Prisma 5.22 fijado y esquema escrito a mano
- **Contexto:** las versiones 7 y 8 de Prisma rompían el `schema.prisma` y `prisma init` fallaba con `CSe.isError is not a function` en Node 24.
- **Opciones:** seguir con la versión nueva, o fijar la 5.
- **Elección:** `prisma@5` y `@prisma/client@5` (quedó la 5.22.0), creando `schema.prisma` y `.env` manualmente.
- **Razón:** es la combinación que ya funcionaba con la guía del proyecto.
- **Consecuencias:** quedan fuera las novedades de las versiones nuevas. Si se actualiza Prisma, habrá que migrar el esquema.
- **Quién decidió:** la IA propuso y el autor aceptó.
- **Evidencia:** conversación + commit `a99f128`.

### D-07. Autenticación por rol
- **Contexto:** el instructor debe registrarse, y los clientes los crea el instructor.
- **Opciones:** correo y contraseña para todos, o un mecanismo distinto para cada rol.
- **Elección:**
  - El instructor entra con correo y contraseña.
  - El cliente entra con un código de 6 caracteres que genera el instructor.
  - Ambos usan JWT con Passport y guards por rol.
- **Razón:** el cliente no necesita crear cuenta ni recordar contraseña, y el instructor controla su acceso.
- **Consecuencias:** hay que dar el código al cliente por fuera de la app. Los códigos se vuelven un dato sensible.
- **Quién decidió:** el autor y la IA en conjunto, desde el documento de requisitos.
- **Evidencia:** conversación + commit `3468309`.

### D-08. `prisma db push` en lugar de migraciones
- **Contexto:** Prisma detectó "drift" y propuso resetear el esquema al migrar en una base sin carpeta de migraciones.
- **Opciones:** aceptar el reset, o usar `db push`.
- **Elección:** el autor respondió que no al reset y se usó `prisma db push`.
- **Razón:** evitar perder datos de prueba y simplificar el flujo del proyecto escolar.
- **Consecuencias:**
  - No hay historial de migraciones (el repo no tiene `prisma/migrations`). Para un despliegue real habría que empezar a migrar.
  - La IA tomó en cuenta esta decisión el 20 de noviembre al evitar cambios de esquema (D-31 y D-34).
- **Quién decidió:** el autor.
- **Evidencia:** conversación + commit `a99f128`.

### D-09. Backend por fases con script de pruebas
- **Contexto:** el autor pidió hacerlo "paso a paso".
- **Opciones:** entregar todo el backend de una vez, o por fases con verificación.
- **Elección:** siete fases (auth y clientes, rutinas, asistencia, running, progreso y calificación, push y avisos, estadísticas), cada una probada.
- **Razón:** poder verificar cada fase antes de seguir y entender qué se creaba. El autor pidió además una lista de archivos por fase para armar el repositorio.
- **Consecuencias:** quedó `test-all.ps1`, que recorre todos los requisitos de punta a punta, y el repositorio quedó con commits por fase.
- **Quién decidió:** el autor.
- **Evidencia:** conversación + commits `3468309` a `e2a9925`.

### D-10. Estructura de la app con Expo Router y grupos por rol
- **Contexto:** arrancar la app con dos tipos de usuario.
- **Opciones:** una navegación común o grupos separados.
- **Elección:** plantilla con Expo Router y grupos `(auth)`, `(instructor)` y `(client)`, cada uno con barra de pestañas inferior. Las pantallas de detalle quedan fuera de los grupos.
- **Razón:** cada rol ve secciones distintas, y la barra inferior se usa más que un menú colapsable.
- **Consecuencias:**
  - El requisito RU-02 ("menú colapsable") ya no coincide con lo construido y el documento de requisitos debe actualizarse.
  - Los nombres de los grupos aparecían en el botón de regresar de iOS (resuelto en D-33).
- **Quién decidió:** la IA propuso y el autor aceptó.
- **Evidencia:** conversación + commit `782c146`.

### D-11. React Native Paper como librería de UI
- **Contexto:** elegir entre UI Kitten y React Native Paper.
- **Elección:** React Native Paper, recomendado por la IA.
- **Razón:** componentes Material Design con tema configurable mediante `useTheme`.
- **Consecuencias:**
  - Los colores deben salir del tema, no de constantes. Esto se volvió regla tras el incidente del listado de clientes en verde.
  - Algunos componentes de Paper tienen comportamientos de diseño que hubo que corregir el 20 de noviembre: el `Surface` del modal centra su contenido, `SegmentedButtons` tiene ancho mínimo y `Card` usa dos capas (D-29 y D-37).
- **Quién decidió:** el autor, con la recomendación de la IA.
- **Evidencia:** conversación + commit `800e9f9`.

### D-12. Arquitectura hook + componentes y reglas de estilo
- **Contexto:** el autor pidió separar la lógica de la vista desde el login, y luego en cada pantalla.
- **Elección:** hook `use*` para la lógica, componentes para la vista, y pantallas delgadas en `src/app`.
- **Reglas fijadas por el autor** a medida que revisaba el código:
  - Estilos con `StyleSheet.create` y una propiedad por línea.
  - Sin `as const` ni `position: absolute`.
  - Sin `any`.
  - Colores del tema con `useTheme`.
  - Badge con texto o ícono blanco, y títulos de sección sencillos.
- **Razón:** legibilidad y consistencia, y reutilizar piezas entre pantallas.
- **Consecuencias:**
  - Más archivos pequeños y rutas de importación más largas, a cambio de pantallas fáciles de leer. Los commits `6395c92` y `f13875e` muestran el refactor.
  - **Observación:** en la sesión del 20 de noviembre la IA usó `as const` en dos lugares: `detailOptions` en `_layout.tsx` y el objeto `LIMITS`. Va contra la regla, y el autor no lo señaló. Conviene revisarlo.
- **Quién decidió:** el autor.
- **Evidencia:** conversación + commits `6395c92`, `f13875e`, `018b712`.

### D-13. Pantallas completas en lugar de modales
- **Contexto:** crear plantilla y asignarla se hacía en modales.
- **Opciones:** conservar los modales o llevar ambos a pantallas.
- **Elección:** pantallas completas (`new-template`, `assign-template/[id]`), con calendario nativo y un ícono junto a la fecha.
- **Razón:** formularios largos con ejercicios dinámicos no caben bien en un modal.
- **Consecuencias:** el commit `20df981` elimina `NewTemplateModal` y `AssignTemplateModal` y crea sus formularios en pantalla, con un balance de 1.586 líneas añadidas contra 2.169 eliminadas (en buena parte `package-lock.json`).
- **Quién decidió:** el autor.
- **Evidencia:** conversación + commit `20df981`.

### D-14. Subir a Expo SDK 58
- **Contexto:** la versión de Expo Go de iOS pedía SDK 58 y el proyecto estaba en el 57.
- **Opciones:** quedarse en 57 (sin poder probar en iPhone) o actualizar.
- **Elección:** actualizar con `npx expo install --fix -- --legacy-peer-deps`.
- **Razón:** el autor probaba en iPhone con Expo Go.
- **Consecuencias:** hubo ajustes de compatibilidad (encabezados en iOS 26, tipos de `tabBarIcon`). El documento de requisitos todavía decía SDK 54 o 57.
- **Quién decidió:** el autor, guiado por el error de compatibilidad.
- **Evidencia:** conversación + commit `20df981`.

### D-15. Resolver la IP del backend automáticamente
- **Contexto:** la IP del equipo cambió entre redes (10.41.6.111, 192.168.1.118 y 192.168.1.75) y el firewall bloqueaba el puerto.
- **Opciones:** editar la IP a mano en cada cambio, o resolverla.
- **Elección:** tomar la IP de `Constants.expoConfig.hostUri` en desarrollo, con `EXPO_PUBLIC_API_URL` en `.env` como respaldo, y un timeout.
- **Razón:** la IP del equipo que sirve la app es la misma que la del backend en desarrollo.
- **Consecuencias:**
  - Funciona sin tocar nada en desarrollo. En un build propio o en un `eas update` hay que definir la URL real del backend.
  - Según la sesión del 20 de noviembre, el timeout actual en `api/client.ts` es de 30 s (`timeout: 30000`), no de 10 s.
  - En desarrollo, la app solo puede llegar al backend local desde la misma red wifi. Esto limita las pruebas de running fuera de casa (B-28).
- **Quién decidió:** el autor propuso guardar la URL en `.env`, y la IA agregó la resolución automática.
- **Evidencia:** conversación + commit `20df981` (cambios en `api/client.ts`) + sesión.

### D-16. Gráficas con `react-native-svg`
- **Contexto:** mostrar la evolución de las mediciones.
- **Opciones:** librerías de gráficas (chart-kit o victory) o dibujar con SVG.
- **Elección:** componente propio `MeasurementChart` con `react-native-svg`.
- **Razón:** menos dependencias y compatibilidad directa con SDK 58. `react-native-svg` ya se usaba para el QR.
- **Consecuencias:** hay que mantener el código de la gráfica. El documento de requisitos mencionaba otras librerías y debe corregirse.
- **Quién decidió:** la IA propuso y el autor aceptó.
- **Evidencia:** conversación + commit `0250487`.

### D-17. Notificaciones push con `expo-notifications`
- **Contexto:** el documento incluía avisos y recordatorios.
- **Elección:** push remoto con `expo-notifications` y `expo-server-sdk` en el backend, con tipo de notificación (`routine`, avisos) y navegación al tocarla.
- **Limitaciones aceptadas:** el push remoto no funciona en Expo Go de Android desde SDK 53, y requiere dispositivo físico y `eas init`. Se probó en iPhone.
- **Consecuencias:** hay campana de avisos en el encabezado y token guardado por usuario. Probar Android exige un build propio.
- **Quién decidió:** el autor, informado de las limitaciones.
- **Evidencia:** conversación + commits `feb177b`, `9e0ea4b`.

### D-18. Cliente desactivado se valida en cada petición
- **Contexto:** al desactivar un cliente, su token seguía siendo válido hasta vencer.
- **Opciones:** esperar a que expire el token, o consultar la base en cada petición.
- **Elección:** `JwtStrategy.validate` consulta la base y rechaza con 401 si el cliente está inactivo.
- **Razón:** el instructor espera que el cambio tenga efecto de inmediato.
- **Consecuencias:** una consulta extra por petición, aceptable para el tamaño del proyecto. Una cuenta eliminada también deja de ser válida.
- **Quién decidió:** el autor pidió el comportamiento y la IA propuso el mecanismo.
- **Evidencia:** conversación + commit `fd42242`.

### D-19. Sesión vencida: cerrar una sola vez y sin mostrar error
- **Contexto:** al vencer el token, el autor veía el error crudo de axios y la pantalla se veía mal.
- **Elección:** el interceptor:
  - llama a un handler que cierra sesión una sola vez;
  - devuelve una promesa que no resuelve, para que las pantallas no muestren el error;
  - muestra una alerta solo si el mensaje es distinto de `Unauthorized`.
- **Consecuencias:** el usuario vuelve al login de forma limpia. Un mensaje específico, como el de cuenta desactivada, sí se muestra.
- **Quién decidió:** el autor lo pidió y la IA lo diseñó.
- **Evidencia:** conversación + commits `a14e8d5`, `fd42242`.

### D-20. Modo offline limitado a marcar ejercicios
- **Contexto:** el cliente puede entrenar sin cobertura.
- **Opciones:** offline completo para todas las acciones, o solo para la acción más frecuente.
- **Elección:** guardar rutinas en caché y encolar el último estado de cada ejercicio (`exerciseId → completed`). Sincronizar al volver la red, al volver a la app y cada 15 s.
- **Razón:** marcar ejercicios es lo que se hace durante el entrenamiento. La cola guarda solo el último estado, así no hay conflictos entre toques repetidos.
- **Consecuencias:**
  - El resto de las acciones (calificar, medir, asistencia) requiere conexión. Hay un banner que informa el estado de sincronización.
  - El modo offline solo aplica al cliente. Las pantallas del instructor no tienen caché (ver D-36).
  - La cola tenía un fallo al marcar rápido, corregido el 20 de noviembre (D-35).
- **Quién decidió:** el autor, con el alcance propuesto por la IA.
- **Evidencia:** conversación + commit `38c5b3d`.

### D-21. Una sola calificación por sesión
- **Contexto:** el cliente califica el esfuerzo de una rutina.
- **Elección:** una calificación por rutina; una segunda devuelve 409 y la app oculta el botón si ya calificó (`alreadyRated`).
- **Razón:** evitar duplicados que distorsionen las estadísticas del instructor.
- **Consecuencias:** no se puede corregir una calificación. Habría que agregar edición si hiciera falta.
- **Quién decidió:** la IA propuso y el autor aceptó.
- **Evidencia:** conversación + commit `323c83b`.

### D-22. Asistencia automática solo con la app abierta
- **Contexto:** el requisito RF-09 pedía registrar la asistencia al llegar al gimnasio.
- **Opciones:** ubicación en segundo plano, o revisar cuando la app está activa.
- **Elección:**
  - Revisar al abrir la app, al volver a ella y cada 5 minutos mientras siga abierta, con un hueco mínimo de 30 s entre intentos.
  - Pedir el permiso una sola vez, con una explicación previa.
  - Si el cliente dice "Ahora no", la asistencia sigue disponible con el botón manual y el QR.
- **Razón:** cumple el requisito tal como está escrito y evita el permiso "Siempre".
- **Consecuencias:** si la app está cerrada no registra. Dentro de edificios el GPS puede fallar, y el QR de la entrada es el respaldo. El backend no cambió: ya validaba radio y una asistencia por día.
- **Quién decidió:** el autor aprobó empezar por este requisito ("sí"), y la IA propuso el diseño.
- **Evidencia:** conversación + commit `8ad6454`.

### D-23. Reemplazar `Alert` por un componente propio
- **Contexto:** el commit `8ad6454` cambia casi todos los hooks para usar `AppAlert`, un modal de Paper con la misma firma que `Alert.alert`.
- **Elección:** cola de alertas con `useSyncExternalStore` y un host montado en el layout raíz.
- **Razón probable:** que las alertas respeten el tema y se vean igual en todas las plataformas. El commit no lo documenta.
- **Consecuencias:** los hooks cambian solo el import. `useAutoCheckin` también quedó con el componente. El 20 de noviembre se reutilizó para la confirmación de ubicación del gimnasio (D-28).
- **Quién decidió:** **sin registro en la conversación.**
- **Evidencia:** commit `8ad6454`.

### D-24. Validación global y ajuste de ejercicios por cliente (RF-26)
- **Contexto:** el commit `ff9f25f` agrega a `main.ts` un `ValidationPipe` global con `whitelist` y `transform`, comentado como cumplimiento de RF-30 y RF-31.
- **Elección en el backend:** `AssignTemplateDto` acepta `exercises` (ajuste común) y `overrides` (ajustes por cliente, con prioridad).
- **Elección en la app:** `AdjustExercisesModal`, `useExerciseDrafts` y `ClientRoutinesView`, para editar y eliminar rutinas ya asignadas.
- **Consecuencias:** quedan cubiertos RF-26 y RF-05, que antes estaban pendientes en el plan. Ese `ValidationPipe` global es el que aplica los límites de D-34.
- **Quién decidió:** **sin registro en la conversación** (el plan de la conversación los marcaba como opcional).
- **Evidencia:** commit `ff9f25f`.

### D-25. Paleta neutra en lugar del lila
- **Contexto:** hasta octubre la app usaba tonos lila de Paper, y el autor pidió explícitamente conservarlos en el listado de clientes.
- **Elección:** el commit `6024c66` cambia el tema a negro, blanco y grises, incluyendo los tokens de contenedor, superficie y elevación, que en MD3 vienen teñidos de morado.
- **Consecuencias:**
  - `primary` pasa a `#111111`. `RunHistorySummary` ya usa `colors.primary` y `colors.onPrimary`, y por eso se adapta solo. Esto confirma que usar el tema fue una buena decisión (D-11 y D-12).
  - El 20 de noviembre, el rediseño de calificaciones se hizo sin agregar colores (D-32).
- **Quién decidió:** **sin registro en la conversación.**
- **Evidencia:** commit `6024c66`.

### D-26. Preparar builds con EAS
- **Contexto:** el commit `e023320` actualiza dependencias de Expo, agrega `eas.json` (perfiles `development`, `preview` con APK y `production`) y el `package` de Android.
- **Relación con decisiones anteriores:** responde a las limitaciones de D-03 y D-17 (push en Android y segundo plano requieren un build propio). El commit no lo explica, así que es una inferencia.
- **Consecuencias:** desde el 20 de noviembre, la vía recomendada para llevar los cambios de JavaScript a la app instalada es `eas update` en el canal del build (`preview` o `production`), sin recompilar.
- **Quién decidió:** **sin registro en la conversación.**
- **Evidencia:** commit `e023320` + sesión.

### D-27. Base local para pruebas y Neon para producción
- **Contexto:** el autor quería probar con su Postgres local en lugar de la base de Neon.
- **Opciones:** crear una base nueva, o reutilizar el contenedor `nest_prisma_db` (D-05), donde ya existía `training_app`.
- **Elección:**
  - Reutilizar el contenedor.
  - Cambiar `DATABASE_URL` en el `.env` del backend y dejar la URL de Neon comentada para volver a ella.
- **Razón:** la base local ya tenía todas las tablas, así que no hacía falta `prisma db push`.
- **Consecuencias:**
  - El error de conexión era una contraseña distinta a la del contenedor. La IA lo diagnosticó sin mostrar la contraseña.
  - La URL de Neon comentada tenía `DATABASE_URL=` repetido dentro de las comillas. La IA lo señaló para que no fallara al descomentarla.
- **Quién decidió:** el autor.
- **Evidencia:** sesión.

### D-28. Confirmar antes de cambiar la ubicación del gimnasio
- **Contexto:** el botón "Usar mi ubicación actual" guardaba la ubicación al primer toque. Un toque accidental cambiaba dónde se valida la asistencia de todos los clientes.
- **Elección:**
  - Pedir confirmación con `AppAlert` antes de solicitar el GPS. El texto es distinto si ya había una ubicación guardada.
  - El radio se valida antes de mostrar el modal.
- **Razón:** es una acción con efecto sobre todos los clientes.
- **Consecuencias:** un toque extra al configurar el gimnasio.
- **Quién decidió:** el autor lo pidió; la IA eligió confirmar también la primera vez.
- **Evidencia:** sesión + commit `47a828b`.

### D-29. Modal común para formularios (`FormModal`)
- **Contexto:** en los modales con inputs no se podía cerrar el teclado tocando afuera, sobre todo al ajustar ejercicios. Además, tocar el fondo cerraba el modal y se perdía lo escrito.
- **Opciones:** corregir cada modal por separado, o crear un componente común.
- **Elección:** `FormModal`, que hace tres cosas:
  - tocar una zona que no sea un control cierra el teclado;
  - con el teclado abierto, tocar el fondo o el botón atrás solo cierra el teclado;
  - la altura máxima se calcula en píxeles y el contenido se alinea arriba.

  Lo usan los 4 modales con inputs: ajustar ejercicios, nueva medición, nuevo cliente y calificar sesión.
- **Razón:** un solo lugar para el comportamiento del teclado y del diseño.
- **Consecuencias:**
  - La primera versión dejó un espacio debajo del botón Guardar, que se corrigió en el commit `73dc6e6`.
  - El modal de nueva medición ganó un botón Cancelar; el de calificar no lo tiene.
- **Quién decidió:** el autor reportó el problema; la IA propuso el componente común.
- **Evidencia:** sesión + commits `baa0e7e`, `73dc6e6`.

### D-30. Nombre de ejercicio en varias líneas
- **Contexto:** los nombres largos se salían del borde del input.
- **Opciones:** recortar el texto en una línea, o dejar que el campo crezca.
- **Elección:**
  - El campo crece hacia abajo, y Enter cierra el teclado.
  - Los saltos de línea pegados se convierten en espacios.
  - Series, Reps y el botón de quitar se alinean arriba.
- **Razón:** el instructor ve siempre el nombre completo y se guarda en una sola línea.
- **Consecuencias:** las filas pueden tener alturas distintas. Desde D-34, el nombre tiene un máximo de 50 caracteres.
- **Quién decidió:** la IA propuso la solución al problema reportado por el autor.
- **Evidencia:** sesión + commit `baa0e7e`.

### D-31. Nombre de la sesión en calificaciones sin cambiar el esquema
- **Contexto:** el instructor veía la calificación pero no a qué rutina correspondía. `SessionRating` guarda `routineId`, pero no tiene relación con `Routine` en Prisma.
- **Opciones:** agregar la relación al esquema, o buscar los títulos en el servicio.
- **Elección:**
  - `getSessionRatings` busca los títulos con una sola consulta adicional y agrega `routineTitle` a la respuesta.
  - Si la rutina ya no existe, la app muestra "Rutina eliminada".
- **Razón:**
  - Agregar la relación obligaba a migrar Neon (ver D-08).
  - La migración podía fallar si había calificaciones de rutinas borradas.
- **Consecuencias:** solo cambia el endpoint del instructor. La vista del cliente no cambió.
- **Quién decidió:** la IA propuso y el autor aceptó (lo incluyó en el commit).
- **Evidencia:** sesión + commit `73dc6e6`.

### D-32. Calificaciones en escala de grises según el esfuerzo
- **Contexto:** el autor pidió más estilo en las filas de calificación del instructor.
- **Opciones:** agregar colores (por ejemplo, de verde a rojo según el esfuerzo), o trabajar con la paleta neutra de D-25.
- **Elección:** un recuadro con la calificación cuyo gris se oscurece del 1 al 5. Además:
  - una barra de 5 segmentos;
  - el nombre de la rutina como título;
  - la nota del cliente en un bloque aparte;
  - la fecha con ícono.
- **Razón:** respetar la paleta neutra que eligió el autor.
- **Consecuencias:** los tonos de gris están escritos en el componente (`EFFORT_SHADES`), no en el tema. Es una excepción a la regla de D-12.
- **Quién decidió:** la IA propuso el diseño; el autor lo incluyó en el commit.
- **Evidencia:** sesión + commit `73dc6e6`.

### D-33. Botón de regresar sin texto
- **Contexto:** en iOS, el botón de regresar mostraba "(instructor)" o "(client)", el nombre del grupo de rutas (D-10).
- **Opciones:**
  - ponerles título a los grupos;
  - ocultar el texto del botón.
- **Elección:** `headerBackButtonDisplayMode: 'minimal'` en las opciones de todas las pantallas de detalle.
- **Razón:** no cambia las rutas, y el botón se ve igual en toda la app.
- **Consecuencias:** en iOS el botón muestra solo la flecha. En Android no cambia nada.
- **Quién decidió:** el autor preguntó si era fácil de arreglar sin afectar las rutas; la IA eligió esta opción.
- **Evidencia:** sesión + commit `4dc78d1`.

### D-34. Límites de longitud y rango en backend y app
- **Contexto:** ningún texto tenía máximo, ni en el backend ni en la app, y los números solo tenían mínimos. Postgres guarda los `String` como `text` sin límite.
- **Opciones:**
  - validar solo en la app;
  - validar en el backend;
  - limitar las columnas en la base con `VarChar`.
- **Elección:**
  - **Backend (obligatorio):** `@MaxLength`, `@Max` y `@ArrayMaxSize` en 11 DTOs, con los valores en `src/common/limits.ts`.
  - **App:** `maxLength` en los inputs y reglas de máximo en los formularios, con una copia de los límites en `src/features/forms/limits.ts`.
  - **Valores:**
    - nombres: 60;
    - correo: 254;
    - contraseña: 72 bytes (límite de bcrypt);
    - título de rutina: 60;
    - nombre de ejercicio: 50;
    - 30 ejercicios por rutina;
    - 20 series y 100 repeticiones;
    - avisos: título de 80 y mensaje de 1000;
    - nota de calificación: 500;
    - peso: 400 kg; medidas: 300 cm;
    - radio del gimnasio: de 10 a 1000 m;
    - 1000 puntos de carrera por envío.
- **Razón:**
  - Evitar datos que rompan el diseño o la gráfica de progreso.
  - Evitar textos enormes enviados directo a la API.
  - Evitar contraseñas que bcrypt recortaría sin avisar.
  - No se usó `VarChar` para no migrar Neon (D-08).
- **Ajuste del autor:** la IA había propuesto un máximo de 100 clientes por asignación. El autor preguntó si eso limitaba los clientes por instructor (no lo hacía) y pidió quitarlo.
- **Consecuencias:**
  - Los puntos de carrera se envían en partes de 1000. Si una parte falla, solo se reintentan los puntos que faltan.
  - Los límites están en dos archivos que hay que mantener iguales.
  - Datos existentes que superen un límite marcarán error al editarlos.
- **Quién decidió:** el autor pidió primero solo la recomendación, luego aprobó aplicarla y ajustó un límite.
- **Evidencia:** sesión + commit `e4125bd`.

### D-35. Corregir la sincronización en la app en lugar de cambiar de hosting
- **Contexto:** con Render y Neon, al marcar ejercicios muy rápido aparecía un error y no se sincronizaba bien. El autor preguntó si se arreglaría usando sus 100 créditos de Azure.
- **Diagnóstico de la IA:**
  - `flushQueue()` trabajaba con una "foto" de la cola. Los cambios hechos durante un envío se quedaban esperando el reintento de 15 s.
  - Mientras tanto aparecía "No hay respuesta del servidor" aunque el servidor sí respondiera, porque `failing` era `remaining > 0`.
  - El plan gratis de Render, que se apaga y tarda en despertar, empeoraba el problema, pero no era la causa.
- **Opciones:**
  - cambiar a Azure. El plan gratis F1 también se apaga; el B1 con "Always On" cuesta unos 13 USD al mes;
  - corregir la app.
- **Elección:** corregir la app.
  - Si llegan cambios durante un envío, se hace otro envío en cuanto termina.
  - `failing` solo es verdadero cuando el servidor de verdad no respondió.
- **Razón:** el error venía de la app y habría pasado con cualquier hosting.
- **Consecuencias:** el arranque lento de Render gratis sigue existiendo, pero la app ya reintenta sola. Cambiar de hosting queda como opción para quitar esa espera.
- **Quién decidió:** el autor ("sí"), tras el diagnóstico de la IA.
- **Evidencia:** sesión + commit `533779d`.

### D-36. Estado "Sin conexión" con Reintentar en lugar de `console.error`
- **Contexto:** en modo avión, como instructor, aparecían errores de axios. Las pantallas del instructor no tienen modo offline (D-20). Además:
  - las listas decían "Todavía no tienes…" como si no hubiera datos;
  - Gimnasio decía que no había ubicación configurada;
  - Estadísticas se quedaba cargando para siempre.
- **Opciones:**
  - agregar caché offline también al instructor;
  - mostrar un estado de error claro.
- **Elección:**
  - `loadErrorMessage()` no escribe en consola los errores de red y sí registra los demás como advertencia.
  - El componente `LoadErrorState` muestra "Sin conexión con el servidor" con un botón Reintentar.
  - Se aplica en 8 pantallas: Clientes, Plantillas, Estadísticas, Avisos, Asistencia, Gimnasio, Corridas y Progreso.
  - Si ya había datos cargados, se siguen mostrando.
- **Razón:** el instructor necesita conexión para casi todas sus acciones. Un estado de error claro es más simple que un segundo modo offline.
- **Consecuencias:** las pantallas de detalle de un cliente siguen mostrando una alerta en cada carga fallida.
- **Quién decidió:** la IA propuso la solución al problema reportado por el autor.
- **Evidencia:** sesión + commit `ce54f1f`.

### D-37. Tarjetas de estadísticas con `View` en lugar del `Card` de Paper
- **Contexto:** en Estadísticas, "Clientes activos" se veía como una tarjeta encima de otra. El `Card` de Paper tiene dos capas, y al estirarse a la altura de su vecina solo se estiraba la capa de la sombra.
- **Opciones:**
  - dejar cada tarjeta con su propia altura;
  - cambiar el modo del `Card`;
  - usar una `View`.
- **Elección:** una `View` con el fondo `elevation.level1` del tema, bordes redondeados y `boxShadow`.
- **Razón:** con una sola capa, las dos tarjetas de cada fila quedan de la misma altura.
- **Consecuencias:** `boxShadow` requiere la nueva arquitectura de React Native, que ya usa el proyecto (RN 0.88). Ese mismo día se corrigió un problema parecido en `ClientFilterChips`: un `ScrollView` horizontal ocupaba media pantalla (commit `de44aed`).
- **Quién decidió:** la IA propuso la solución al problema reportado por el autor.
- **Evidencia:** sesión + commits `9446495`, `de44aed`.

### D-38. Conservar ESLint en la app
- **Contexto:** el proyecto no tenía ESLint. Al correr `npx expo lint` para revisar un cambio, Expo lo instaló y creó `eslint.config.js`.
- **Opciones:** quitarlo, o conservarlo.
- **Elección:** conservarlo. El autor incluyó `eslint.config.js`, `package.json` y `package-lock.json` en el commit `47a828b`.
- **Razón:** `AGENTS.md` pide correr el lint antes de dar una tarea por terminada.
- **Consecuencias:**
  - El lint de todo el proyecto marcó problemas que ya existían: 5 errores y 11 advertencias.
  - Uno de los errores es `react-hooks/set-state-in-effect`, en `SyncContext.tsx`.
- **Quién decidió:** la IA lo recomendó y el autor lo incluyó en el commit.
- **Evidencia:** sesión + commit `47a828b`.

### D-39. Publicar actualizaciones con `--channel` en lugar de `--auto`
- **Contexto:** el README del autor indicaba publicar la app con `eas update --auto`.
- **Problema detectado por la IA:** `--auto` publica en una rama de EAS con el nombre de la rama de Git (`main`). Los builds del proyecto escuchan los canales `preview` y `production` (`eas.json`), así que la actualización no les llegaría.
- **Elección inicial:** `npx eas-cli@latest update --channel preview` (o `production`, según el build), con una nota en el README de por qué no usar `--auto`.
- **Corrección (22 nov):** esa recomendación no aplicaba. En EAS no había canales y el único build no tenía `expo-updates`. El README quedó con `npx eas-cli@latest update --branch main`, la forma en que el autor ya publicaba (ver D-44).
- **Otros cambios al README en la misma revisión:**
  - se quitó `npm test`, porque el backend no tiene pruebas unitarias;
  - se agregaron las carpetas `common/` y `prisma/` a la arquitectura;
  - se agregaron la tabla de límites de datos y las decisiones de la sesión del 20 de noviembre.
- **Consecuencias:** las demás correcciones del README se conservaron; la instrucción de publicación se corrigió el 22 de noviembre.
- **Quién decidió:** el autor pidió revisar y aplicar los cambios necesarios; la IA propuso cada corrección.
- **Evidencia:** sesión + commit `212445b`.

### D-40. Ofrecer "Abrir ajustes" cuando un permiso quedó negado
- **Contexto:** al auditar los casos límite (B-36), la IA encontró este problema:
  - Si el usuario negaba un permiso de forma permanente, el sistema ya no volvía a mostrar la pregunta.
  - La app repetía "Necesitamos permiso…" sin explicar cómo activarlo.
  - El usuario quedaba atorado en la cámara del QR, la asistencia, el gimnasio y la corrida.
- **Opciones:** solo mejorar el texto, o llevar al usuario a los ajustes.
- **Elección:** un helper común, `alertPermissionDenied`.
  - Si el sistema todavía puede preguntar, muestra el mensaje de siempre.
  - Si ya no puede (`canAskAgain` es falso), muestra "Permiso desactivado" con un botón **Abrir ajustes** (`Linking.openSettings()`).
- **Razón:** es la única forma de recuperar el permiso, y un solo helper deja el mismo comportamiento en las 4 pantallas.
- **Consecuencias:** la asistencia automática no cambió: ya respetaba un "Ahora no" y no vuelve a preguntar.
- **Quién decidió:** el autor eligió aplicar este arreglo de la lista propuesta por la IA.
- **Evidencia:** sesión + commit `876d315`.

### D-41. Candados contra doble toque en `AppAlert` y en la corrida
- **Contexto:** casi todos los botones de guardar ya se desactivaban con `disabled={saving}`. La auditoría encontró 3 huecos:
  - "Iniciar corrida" pedía el permiso antes de marcar el estado "iniciando", así que dos toques rápidos podían crear **dos corridas**;
  - dos toques en un botón que abre una confirmación abrían dos confirmaciones;
  - un doble toque en un botón de `AppAlert` podía ejecutar la acción dos veces.
- **Opciones:** un candado en cada formulario, o candados en los puntos comunes.
- **Elección:**
  - `AppAlert` ignora una alerta si ya hay una abierta con el mismo título y mensaje.
  - Un segundo toque en un botón de una alerta ya cerrada no ejecuta la acción.
  - Iniciar, terminar y retomar una corrida usan un candado con `useRef`, el mismo patrón que ya tenía el registro de asistencia.
- **Razón:** el estado de React tarda un render en desactivar el botón, y la ref se actualiza al instante. Corregir `AppAlert` cubre de una vez todas las confirmaciones de la app.
- **Consecuencias:** dos alertas idénticas seguidas se muestran una sola vez, lo cual también evita mensajes de error repetidos.
- **Quién decidió:** el autor eligió aplicar este arreglo; la IA propuso dónde poner los candados.
- **Evidencia:** sesión + commit `876d315`.

### D-42. Guardar la corrida en curso para continuarla o terminarla
- **Contexto:** si el sistema cerraba la app durante una corrida:
  - los puntos pendientes se perdían, porque estaban en memoria;
  - la sesión quedaba abierta en el backend, sin aparecer en el historial y sin forma de retomarla.
- **Opciones:**
  - registrar en segundo plano: requiere un build propio y el permiso "Siempre" (ver D-03);
  - guardar la corrida en el teléfono y recuperarla al volver.
- **Elección:**
  - La app guarda la corrida activa en `AsyncStorage`: id, inicio, puntos pendientes y hora del último punto. Se guarda al iniciar, cada 5 segundos, después de cada envío y al salir de la app.
  - Al abrir la pantalla Correr, si hay una corrida guardada, se ofrece **Continuar** o **Terminar**.
  - **Terminar** envía la hora del último punto registrado. Para eso, `POST /running/:id/finish` acepta un `endedAt` opcional, que el servidor limita a quedar entre el inicio y la hora actual.
  - Si no hay conexión, la corrida sigue guardada. Si el servidor la rechaza, se borra y se muestra el motivo.
- **Razón:** sin la hora del último punto, la duración incluiría todo el tiempo que la app estuvo cerrada. Es compatible con D-03 porque no requiere el segundo plano.
- **Consecuencias:**
  - **Continuar** cuenta el tiempo desde el inicio original, incluido el rato en que la app estuvo cerrada.
  - El GPS sigue sin registrar mientras la app está en segundo plano.
  - Hasta desplegar el backend, el servidor descarta `endedAt`, porque la validación global quita los campos desconocidos.
  - La corrida guardada se borra al cerrar sesión.
- **Quién decidió:** el autor eligió aplicar este arreglo; la IA propuso el diseño, incluido el cambio en el backend.
- **Evidencia:** sesión + commit `876d315`.

### D-43. Casos límite que se dejaron como están
- **Contexto:** de la auditoría de B-36 quedaron puntos que el autor decidió no cambiar.
- **Elección:**
  - **Girar el celular:** la app queda fija en vertical (`"orientation": "portrait"` en `app.json`). Es una decisión de diseño, no una falta de soporte.
  - **Pantallas de detalle de un cliente sin conexión:** siguen mostrando una alerta en cada carga fallida, en lugar del estado con Reintentar de D-36. Era el arreglo 4, opcional, y el autor no lo eligió.
  - **Formularios a medio escribir:** se pierden si el sistema cierra la app. Si solo se cambia de app y se regresa, se conservan.
- **Razón:** el autor priorizó los 3 arreglos con más impacto: permisos, doble toque y corrida.
- **Quién decidió:** el autor ("solo los 1, 2 y 3").
- **Evidencia:** sesión.

### D-44. Entregar por liga de Expo Go, sin APK
- **Contexto:** la tarea acepta una liga de Expo o un APK. El único APK era del 19 de noviembre, anterior a `expo-updates` y a los cambios de la sesión.
- **Opciones:**
  - compilar un APK nuevo, que primero requiere configurar `EXPO_PUBLIC_API_URL` en EAS, una clave de Google Maps y credenciales de FCM;
  - entregar las ligas de Expo Go.
- **Elección:** entregar las ligas de Expo Go de iOS y Android, publicadas con `eas update --branch main`.
- **Razón:** evita configurar y probar un build nativo justo antes de la entrega.
- **Consecuencias:**
  - Cada publicación genera ligas nuevas, y hay que entregar las de la versión final.
  - En Expo Go de Android no hay notificaciones push remotas (D-17), así que RF-15 se demuestra en iPhone.
  - Falta comprobar que las ligas abran en un celular ajeno.
- **Quién decidió:** el autor ("no haré el APK"), con la información de la IA.
- **Evidencia:** sesión.

### D-45. Historial de mediciones para el instructor (RF-19)
- **Contexto:** el instructor veía la gráfica y el último valor de cada medida, pero no una lista cronológica.
- **Opciones:** mostrar solo la medida seleccionada, o cada registro completo.
- **Elección:** el componente `MeasurementHistory`, debajo de la gráfica, muestra cada registro con su fecha completa y sus valores, del más reciente al más antiguo.
- **Razón:** el cliente puede llenar solo algunas medidas, y ver el registro completo muestra qué se midió cada día.
- **Consecuencias:** no cambia el backend, que ya devolvía las mediciones. La vista del cliente no cambió.
- **Quién decidió:** la IA señaló el faltante y el autor pidió aplicarlo.
- **Evidencia:** sesión.

---

*Documento generado el 19 de noviembre de 2026. Actualizado el 21 de noviembre (sesión del 20 de noviembre) y el 22 de noviembre de 2026 (README, casos límite, revisión de requisitos y cambios finales).*
