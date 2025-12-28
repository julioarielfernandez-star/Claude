# Data - Datos y Modelos

Almacenamiento de datos, modelos entrenados y bases de conocimiento.

## Estructura

### `/models`
Modelos de ML/IA entrenados o fine-tuned

**Posibles modelos:**
- Clasificador de tipo de reclamo
- Predictor de morosidad
- Estimador de costos de reparación
- Detector de urgencias
- Extractor de información de documentos

### `/training`
Datasets y scripts de entrenamiento

**Datasets potenciales:**
- Histórico de reclamos y resoluciones
- Datos de expensas y pagos
- Presupuestos y trabajos realizados
- Comunicaciones con propietarios
- Patrones de morosidad

### `/knowledge_base`
Base de conocimiento para RAG (Retrieval Augmented Generation)

**Contenido:**
- Normativas y leyes aplicables
- Reglamentos de consorcios
- Procedimientos internos
- FAQs
- Documentación técnica de sistemas
- Mejores prácticas de administración
- Base de proveedores confiables

## Formato de Datos

### Esquema de Reclamos
```json
{
  "id": "string",
  "consorcio_id": "string",
  "unidad_id": "string",
  "fecha_creacion": "datetime",
  "tipo": "string",
  "urgencia": "string",
  "descripcion": "string",
  "estado": "string",
  "asignado_a": "string",
  "presupuestos": [],
  "resolución": {},
  "fecha_cierre": "datetime"
}
```

### Esquema de Expensas
```json
{
  "id": "string",
  "consorcio_id": "string",
  "periodo": "string",
  "gastos": [],
  "total": "decimal",
  "distribución": {},
  "fecha_vencimiento": "date",
  "comprobantes": []
}
```

### Esquema de Unidades
```json
{
  "id": "string",
  "consorcio_id": "string",
  "numero": "string",
  "tipo": "string",
  "propietarios": [],
  "coeficiente": "decimal",
  "estado_cuenta": {},
  "legajo": {}
}
```

## Vectorización

Para búsqueda semántica y RAG:
- **Embeddings**: OpenAI Ada, Cohere, modelos open-source
- **Vector DB**: Pinecone, Weaviate, ChromaDB, Qdrant
- **Chunking**: Estrategias de división de documentos
- **Metadata**: Enriquecimiento para filtrado

## Privacidad y Seguridad

⚠️ **IMPORTANTE**: Los datos de propietarios son sensibles
- Cumplir con Ley de Protección de Datos Personales (Argentina)
- Encriptación en reposo y en tránsito
- Acceso basado en roles
- Auditoría de accesos
- Anonimización para análisis
- Backup regular y seguro
