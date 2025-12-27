# Sistema de Pérdida de Peso

Un sistema completo y fácil de usar para ayudarte a alcanzar tus metas de pérdida de peso y mantener un estilo de vida saludable.

## Características

### 1. Dashboard Principal
- **Perfil Personal**: Guarda tu información básica (nombre, edad, género, altura)
- **Registro de Peso**: Monitorea tu peso actual y observa tu progreso
- **Objetivos**: Establece y rastrea tu peso objetivo
- **Resumen Diario**: Visualiza tus calorías consumidas, quemadas y el balance del día

### 2. Calculadoras
- **IMC (Índice de Masa Corporal)**: Calcula tu IMC y conoce en qué categoría te encuentras
- **Calorías Diarias**: Determina cuántas calorías necesitas según tu objetivo (perder, mantener o ganar peso)
- **Agua Recomendada**: Calcula la cantidad de agua que debes beber al día según tu peso

### 3. Registro de Alimentación
- Registra todas tus comidas del día (desayuno, almuerzo, cena, snacks)
- Lleva un conteo de calorías consumidas
- Incluye una guía de referencia de alimentos comunes y sus calorías

### 4. Registro de Ejercicios
- Registra tus actividades físicas diarias
- Diferentes tipos de ejercicios: correr, caminar, ciclismo, natación, pesas, yoga
- Calcula las calorías quemadas
- Guía de referencia de calorías quemadas por ejercicio

### 5. Seguimiento de Progreso
- **Historial de Peso**: Visualiza todos tus registros de peso con cambios mostrados
- **Estadísticas Completas**:
  - Peso inicial, actual y promedio
  - Cambio total de peso
  - Días rastreados
  - Total de registros
  - Calorías consumidas y quemadas en total
  - Progreso hacia tu objetivo
- **Consejos de Salud**: Tips útiles para ayudarte a alcanzar tus metas

## Cómo Usar

### Instalación

No requiere instalación. Simplemente abre el archivo `index.html` en tu navegador web favorito.

### Primeros Pasos

1. **Configura tu Perfil**
   - Ve al Dashboard
   - Completa tu información personal (nombre, edad, género, altura)
   - Haz clic en "Guardar Perfil"

2. **Registra tu Peso Inicial**
   - En el Dashboard, ingresa tu peso actual en la sección "Peso Actual"
   - Haz clic en "Registrar"

3. **Establece tu Objetivo**
   - Ingresa tu peso objetivo deseado
   - Haz clic en "Establecer Objetivo"
   - El sistema te mostrará cuánto te falta para alcanzar tu meta

4. **Calcula tus Necesidades**
   - Ve a la pestaña "Calculadoras"
   - Calcula tu IMC para conocer tu estado actual
   - Calcula tus calorías diarias recomendadas según tu objetivo
   - Calcula cuánta agua debes beber

5. **Registra tu Alimentación**
   - Ve a la pestaña "Alimentación"
   - Registra cada comida del día con su nombre, calorías y tipo
   - Utiliza la guía de referencia para alimentos comunes

6. **Registra tus Ejercicios**
   - Ve a la pestaña "Ejercicios"
   - Registra cada actividad física que realices
   - Ingresa la duración y las calorías aproximadas quemadas
   - Usa la guía de referencia para estimaciones

7. **Monitorea tu Progreso**
   - Ve a la pestaña "Progreso"
   - Revisa tu historial de peso completo
   - Observa tus estadísticas y tendencias
   - Lee los consejos para mantenerte motivado

### Registro Diario Recomendado

Para obtener los mejores resultados, se recomienda:

- **Mañana**: Pésate en ayunas (mismo horario cada día para consistencia)
- **Durante el Día**: Registra todas tus comidas y ejercicios en tiempo real
- **Noche**: Revisa tu balance calórico del día y planifica el día siguiente

## Fórmulas Utilizadas

### IMC (Índice de Masa Corporal)
```
IMC = peso (kg) / (altura (m))²
```

Categorías:
- < 18.5: Bajo peso
- 18.5 - 24.9: Peso normal
- 25 - 29.9: Sobrepeso
- ≥ 30: Obesidad

### Calorías Diarias (Fórmula Harris-Benedict)

**Hombres:**
```
BMR = 88.362 + (13.397 × peso) + (4.799 × altura) - (5.677 × edad)
```

**Mujeres:**
```
BMR = 447.593 + (9.247 × peso) + (3.098 × altura) - (4.330 × edad)
```

**TDEE (Total Daily Energy Expenditure):**
```
TDEE = BMR × Factor de Actividad
```

Factores de Actividad:
- Sedentario: 1.2
- Ligeramente activo: 1.375
- Moderadamente activo: 1.55
- Muy activo: 1.725
- Extremadamente activo: 1.9

### Agua Diaria Recomendada
```
Agua (ml) = peso (kg) × 35 ml
```

## Consejos para el Éxito

1. **Sé Consistente**: Registra tus datos diariamente
2. **Sé Paciente**: La pérdida de peso saludable es de 0.5-1 kg por semana
3. **Déficit Calórico Moderado**: Mantén un déficit de 300-500 kcal/día
4. **Hidrátate**: Bebe suficiente agua durante todo el día
5. **Duerme Bien**: 7-8 horas de sueño de calidad
6. **Come Balanceado**: Incluye proteínas, carbohidratos complejos y grasas saludables
7. **Ejercicio Regular**: Combina cardio y entrenamiento de fuerza
8. **Mide tu Progreso**: No solo el peso, también cómo te sientes y cómo te queda la ropa

## Almacenamiento de Datos

Todos tus datos se almacenan localmente en tu navegador utilizando localStorage. Esto significa:

- ✅ Tus datos son completamente privados
- ✅ No se envían a ningún servidor
- ✅ Los datos persisten entre sesiones
- ⚠️ Si borras los datos del navegador, perderás tu historial
- ⚠️ Los datos solo están disponibles en el navegador donde los creaste

### Respaldo de Datos

Para no perder tus datos:
- No borres el caché/datos del navegador para este sitio
- Considera exportar tus datos periódicamente (funcionalidad futura)
- Usa siempre el mismo navegador para acceder al sistema

## Tecnologías Utilizadas

- **HTML5**: Estructura de la aplicación
- **CSS3**: Diseño responsive y moderno
- **JavaScript (Vanilla)**: Lógica de la aplicación
- **LocalStorage**: Almacenamiento local de datos

## Compatibilidad

Compatible con todos los navegadores modernos:
- Google Chrome (recomendado)
- Mozilla Firefox
- Microsoft Edge
- Safari
- Opera

## Requisitos del Sistema

- Navegador web moderno con soporte para JavaScript y LocalStorage
- No requiere conexión a internet una vez descargado

## Advertencias Importantes

⚠️ **Este sistema es una herramienta de ayuda y seguimiento. NO sustituye el consejo médico profesional.**

- Consulta con un médico antes de comenzar cualquier programa de pérdida de peso
- Si tienes condiciones médicas, consulta con un profesional de la salud
- Los cálculos son aproximados y pueden variar según cada persona
- Una pérdida de peso saludable es gradual (0.5-1 kg por semana)

## Preguntas Frecuentes

**P: ¿Puedo usar el sistema en mi teléfono móvil?**
R: Sí, el diseño es completamente responsive y funciona en dispositivos móviles.

**P: ¿Necesito crear una cuenta?**
R: No, el sistema almacena todos los datos localmente en tu navegador.

**P: ¿Puedo eliminar registros incorrectos?**
R: Sí, puedes eliminar entradas de comidas y ejercicios usando el botón "Eliminar".

**P: ¿Cómo puedo resetear mis datos?**
R: Borra los datos del navegador para este sitio o abre la consola del navegador y ejecuta: `localStorage.clear()`

**P: ¿Qué tan preciso es el cálculo de calorías?**
R: Los cálculos son estimaciones basadas en fórmulas científicas establecidas, pero pueden variar según factores individuales.

## Futuras Mejoras

- Gráficos de progreso visual
- Exportar/Importar datos
- Recetas saludables
- Planes de entrenamiento
- Recordatorios y notificaciones
- Modo oscuro
- Múltiples perfiles de usuario

## Licencia

Este proyecto es de código abierto y está disponible para uso personal y educativo.

## Soporte

Para reportar problemas o sugerir mejoras, por favor abre un issue en el repositorio del proyecto.

---

**¡Buena suerte en tu viaje hacia una vida más saludable! 💪🏃‍♂️🥗**
