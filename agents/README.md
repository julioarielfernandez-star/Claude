# Agentes de IA

Este directorio contiene los agentes de IA especializados para diferentes áreas de la administración de consorcios.

## Estructura

### `/customer_service` - Agente de Atención al Cliente
- **Propósito**: Atención 24/7 a propietarios
- **Funciones**:
  - Respuesta automática a consultas frecuentes
  - Gestión de reclamos y tickets
  - Escalamiento a administrador cuando necesario
  - Comunicación multicanal (WhatsApp, Email, Portal)

### `/maintenance` - Agente de Mantenimiento
- **Propósito**: Gestión de reparaciones y mantenimiento preventivo
- **Funciones**:
  - Inspección preventiva automatizada
  - Seguimiento de reclamos de mantenimiento
  - Análisis y comparación de presupuestos
  - Programación de trabajos
  - Control de ejecución y calidad

### `/financial` - Agente Financiero
- **Propósito**: Gestión económica y cobranzas
- **Funciones**:
  - Generación de liquidaciones de expensas
  - Seguimiento de pagos y morosidad
  - Análisis de ingresos y egresos
  - Proyecciones financieras
  - Alertas de vencimientos

### `/legal` - Agente Legal
- **Propósito**: Asesoramiento legal y cumplimiento normativo
- **Funciones**:
  - Consulta de normativas aplicables
  - Preparación de documentación para asambleas
  - Seguimiento de deudores
  - Cumplimiento de reglamentos

### `/documents` - Agente de Gestión Documental
- **Propósito**: Organización y acceso a documentación
- **Funciones**:
  - Digitalización y clasificación de comprobantes
  - Gestión de legajos por unidad
  - Acceso online a documentos
  - Búsqueda inteligente de información

### `/analytics` - Agente de Análisis
- **Propósito**: Análisis de datos y reportes
- **Funciones**:
  - Dashboards automáticos
  - Reportes de gestión
  - Análisis de tendencias
  - KPIs y métricas de desempeño

## Tecnologías Sugeridas

- **Framework de IA**: LangChain, AutoGen, CrewAI
- **LLM**: Claude (Anthropic), GPT-4, modelos open-source
- **Vectorización**: Pinecone, Weaviate, ChromaDB
- **Orquestación**: Apache Airflow, Prefect
- **Comunicación**: WhatsApp Business API, SendGrid
