# Arquitectura del Sistema de IA

## Visión General

Sistema multi-agente basado en arquitectura de microservicios que automatiza procesos clave de administración de consorcios.

---

## Principios de Diseño

### 1. **Modularidad**
Cada agente es independiente y puede desplegarse, escalarse y actualizarse de forma individual.

### 2. **Comunicación Asíncrona**
Los agentes se comunican mediante colas de mensajes (event-driven architecture).

### 3. **Escalabilidad Horizontal**
Cada componente puede escalarse según demanda.

### 4. **Resiliencia**
Circuit breakers, retries, fallbacks para garantizar disponibilidad.

### 5. **Observabilidad**
Logging, métricas y trazabilidad end-to-end de todas las operaciones.

---

## Capas de la Arquitectura

### Capa 1: Interfaces de Usuario

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│   WhatsApp   │    Email     │  Portal Web  │  App Móvil   │
│   Business   │  SendGrid    │   React.js   │   Flutter    │
└──────────────┴──────────────┴──────────────┴──────────────┘
                            ↓
                    ┌──────────────┐
                    │  API Gateway │
                    │   (FastAPI)  │
                    └──────────────┘
```

**Componentes:**
- **API Gateway**: Punto único de entrada, autenticación, rate limiting
- **WhatsApp Webhook Handler**: Recibe y procesa mensajes de WhatsApp
- **Email Handler**: Procesa emails entrantes
- **Web Portal**: Dashboard para propietarios y administradores

---

### Capa 2: Orquestación y Workflows

```
┌────────────────────────────────────────────┐
│        Workflow Orchestration Layer        │
│                                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │ Temporal │  │  Airflow │  │   n8n    │ │
│  └──────────┘  └──────────┘  └──────────┘ │
└────────────────────────────────────────────┘
```

**Responsabilidades:**
- Coordinar múltiples agentes para completar workflows complejos
- Gestionar estado de procesos de larga duración
- Reintentos y manejo de errores
- Scheduling de tareas periódicas

**Workflows Clave:**
1. **Gestión de Reclamos**: 5-10 pasos, múltiples agentes
2. **Ciclo de Expensas**: Proceso mensual automatizado
3. **Mantenimiento Preventivo**: Inspecciones programadas
4. **Onboarding de Consorcio**: 20+ pasos de configuración inicial

---

### Capa 3: Agentes de IA

```
┌─────────────────────────────────────────────────────┐
│                  Agent Layer                        │
│                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │  Customer   │  │ Maintenance │  │  Financial  │ │
│  │   Service   │  │             │  │             │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
│                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │    Legal    │  │  Documents  │  │  Analytics  │ │
│  │             │  │             │  │             │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────┘
```

#### Especificación de Agentes

**Customer Service Agent**
```yaml
name: customer_service_agent
llm: claude-3-5-sonnet-20241022
temperature: 0.7
tools:
  - search_knowledge_base
  - create_ticket
  - get_account_status
  - send_notification
  - escalate_to_human
capabilities:
  - Responder consultas frecuentes
  - Crear tickets de reclamos
  - Consultar estado de cuenta
  - Escalamiento inteligente
```

**Maintenance Agent**
```yaml
name: maintenance_agent
llm: claude-3-5-sonnet-20241022
temperature: 0.3
tools:
  - search_suppliers
  - compare_budgets
  - schedule_work
  - track_progress
  - quality_check
capabilities:
  - Análisis de presupuestos
  - Selección de proveedores
  - Programación óptima
  - Control de calidad
```

**Financial Agent**
```yaml
name: financial_agent
llm: gpt-4-turbo
temperature: 0.1
tools:
  - calculate_expenses
  - generate_statements
  - check_payment_status
  - predict_cash_flow
  - detect_anomalies
capabilities:
  - Generación de liquidaciones
  - Proyecciones financieras
  - Detección de anomalías
  - Análisis de morosidad
```

---

### Capa 4: Herramientas y Servicios

```
┌─────────────────────────────────────────────────────┐
│                  Tools & Services                   │
│                                                     │
│  Database  │  Vector DB │  Cache  │  Queue │  OCR  │
│ PostgreSQL │  Pinecone  │  Redis  │ Rabbit │Vision │
└─────────────────────────────────────────────────────┘
```

**Base de Datos (PostgreSQL)**
- Consorcios, unidades, propietarios
- Transacciones financieras
- Tickets y reclamos
- Audit logs

**Vector Database (Pinecone)**
- Embeddings de documentos
- Base de conocimiento
- Búsqueda semántica
- RAG (Retrieval Augmented Generation)

**Cache (Redis)**
- Sesiones de usuarios
- Resultados frecuentes
- Rate limiting
- Feature flags

**Message Queue (RabbitMQ)**
- Comunicación asíncrona entre agentes
- Event sourcing
- Task queue para Celery

---

### Capa 5: Integraciones

```
┌─────────────────────────────────────────────────────┐
│                  Integrations                       │
│                                                     │
│  Interfast  │ WhatsApp  │ SendGrid │   S3   │ OCR  │
│    API      │  Business │   Email  │Storage │ API  │
└─────────────────────────────────────────────────────┘
```

**Sistemas de Pago**
- Interfast API: Generación de códigos de pago
- Banco Roela: Procesamiento de pagos
- Webhooks: Notificaciones de pagos recibidos

**Comunicación**
- WhatsApp Business API (Twilio)
- Email (SendGrid)
- SMS (Twilio)

**Almacenamiento**
- AWS S3: Documentos, comprobantes, backups
- CloudFront CDN: Delivery de contenido estático

---

## Flujo de Datos

### Ejemplo: Gestión de Reclamo

```
1. Propietario envía WhatsApp
   ↓
2. API Gateway recibe webhook
   ↓
3. Customer Service Agent procesa mensaje
   ↓ (usa RAG para buscar información)
4. Vector DB devuelve contexto relevante
   ↓
5. Agent clasifica reclamo y crea ticket
   ↓ (escribe a base de datos)
6. PostgreSQL almacena ticket
   ↓
7. Event publicado a RabbitMQ
   ↓
8. Maintenance Agent recibe evento
   ↓
9. Solicita presupuestos a proveedores
   ↓
10. Financial Agent evalúa costos
   ↓
11. Si > threshold, notifica consejo
   ↓
12. Customer Service notifica a propietario
```

---

## Seguridad

### Autenticación y Autorización

```
┌──────────────────────────────────────┐
│         Auth0 / Keycloak             │
│                                      │
│  ┌────────────┐  ┌────────────┐     │
│  │   OAuth2   │  │    RBAC    │     │
│  └────────────┘  └────────────┘     │
└──────────────────────────────────────┘
```

**Roles:**
- `propietario`: Ver su unidad, pagar expensas
- `consejero`: Ver consorcio, aprobar presupuestos
- `administrador`: Acceso completo
- `proveedor`: Ver tickets asignados
- `sistema`: Para integraciones

### Encriptación

- **En tránsito**: TLS 1.3 para todas las comunicaciones
- **En reposo**: Encriptación AES-256 para datos sensibles
- **Secrets**: AWS Secrets Manager / HashiCorp Vault

### Compliance

- ✅ Ley de Protección de Datos Personales (Argentina)
- ✅ PCI DSS para manejo de pagos
- ✅ Logs de auditoría inmutables
- ✅ Derecho al olvido (GDPR-like)

---

## Monitoreo y Observabilidad

### Métricas (Datadog / Prometheus)

```yaml
metrics:
  - agent_response_time
  - agent_success_rate
  - ticket_resolution_time
  - payment_success_rate
  - api_latency_p95
  - queue_depth
  - cache_hit_rate
```

### Logging (ELK Stack)

```yaml
logs:
  - application_logs
  - access_logs
  - error_logs
  - audit_logs
  - agent_conversation_logs
```

### Tracing (Jaeger / OpenTelemetry)

- Trazabilidad end-to-end de requests
- Identificación de cuellos de botella
- Debugging de workflows complejos

### Alerting

```yaml
alerts:
  - agent_down: PagerDuty
  - high_error_rate: Slack
  - payment_failure_spike: Email + SMS
  - security_incident: PagerDuty + Email
```

---

## Escalabilidad

### Horizontal Scaling

**Stateless Components** (pueden escalarse libremente):
- API Gateway
- Agentes de IA
- Workers de Celery

**Stateful Components** (requieren coordinación):
- PostgreSQL: Read replicas
- Redis: Redis Cluster
- RabbitMQ: Clustering

### Auto-scaling

```yaml
autoscaling:
  api_gateway:
    min_replicas: 2
    max_replicas: 10
    target_cpu: 70%

  customer_service_agent:
    min_replicas: 3
    max_replicas: 20
    target_queue_depth: 100
```

---

## Disaster Recovery

### Backup Strategy

**Databases:**
- Backup diario completo
- Backup incremental cada 4 horas
- Retención: 30 días
- Cross-region replication

**Documentos:**
- Versioning en S3
- Backup en región secundaria
- Lifecycle policies

### Recovery Time Objectives

- **RTO** (Recovery Time Objective): 4 horas
- **RPO** (Recovery Point Objective): 4 horas

---

## Roadmap Técnico

### Fase 1: MVP (3 meses)
- ✅ Customer Service Agent básico
- ✅ Sistema de tickets
- ✅ Integración WhatsApp
- ✅ Base de conocimiento inicial

### Fase 2: Automatización (6 meses)
- Financial Agent para liquidaciones
- Maintenance Agent para presupuestos
- Workflows de expensas automatizado

### Fase 3: Inteligencia (12 meses)
- Predictive maintenance
- Análisis de morosidad con ML
- Optimización de costos con IA

### Fase 4: Optimización (18 meses)
- Fine-tuning de modelos
- Multi-tenancy optimization
- Advanced analytics

---

**Última actualización:** Diciembre 2025
**Versión:** 1.0
