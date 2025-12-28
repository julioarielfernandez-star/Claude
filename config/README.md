# Configuración

Archivos de configuración para diferentes entornos y servicios.

## Estructura

```
config/
├── development/      # Configuración para desarrollo local
├── staging/          # Configuración para ambiente de pruebas
├── production/       # Configuración para producción
├── secrets/          # Credenciales (⚠️ NO COMMITEAR)
└── templates/        # Plantillas de configuración
```

## Archivos de Configuración

### `agents.yaml`
Configuración de agentes de IA
```yaml
agents:
  customer_service:
    model: "claude-3-5-sonnet"
    temperature: 0.7
    max_tokens: 2000
    system_prompt: "..."

  maintenance:
    model: "claude-3-5-sonnet"
    temperature: 0.3
    tools: ["budget_analyzer", "calendar"]

  financial:
    model: "gpt-4"
    temperature: 0.1
    strict_mode: true
```

### `integrations.yaml`
Endpoints y configuración de integraciones
```yaml
payment_systems:
  interfast:
    base_url: "https://api.interfast.com.ar"
    timeout: 30
    retry_attempts: 3

communication:
  whatsapp:
    provider: "twilio"
    phone_number: "+5491152633707"

  email:
    provider: "sendgrid"
    from: "info@julioarielfernandez.com.ar"
```

### `database.yaml`
Configuración de bases de datos
```yaml
postgres:
  host: "${DB_HOST}"
  port: 5432
  database: "consorcios_db"
  user: "${DB_USER}"
  password: "${DB_PASSWORD}"
  pool_size: 20

vector_db:
  provider: "pinecone"
  index: "knowledge_base"
  dimension: 1536
```

### `workflows.yaml`
Configuración de flujos de trabajo
```yaml
workflows:
  ticket_management:
    auto_assign: true
    escalation_threshold: 24  # hours
    require_approval_above: 50000  # ARS

  expense_cycle:
    generation_day: 1  # día del mes
    due_date_offset: 10  # días
    reminder_days: [7, 3, 1]  # días antes
```

## Variables de Entorno

Crear archivo `.env` (basado en `.env.template`):

```bash
# API Keys
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
INTERFAST_API_KEY=...
SENDGRID_API_KEY=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...

# Database
DB_HOST=localhost
DB_USER=admin
DB_PASSWORD=...

# Environment
ENVIRONMENT=development
DEBUG=true
LOG_LEVEL=INFO
```

## Secrets Management

⚠️ **NUNCA commitear secrets al repositorio**

Opciones para manejo de secrets:
1. **Variables de entorno** (desarrollo local)
2. **AWS Secrets Manager** (producción)
3. **HashiCorp Vault** (enterprise)
4. **Azure Key Vault** (cloud)

### Estructura de secrets
```
config/secrets/
├── .gitignore        # Asegurar que todo esté ignorado
├── development.env
├── staging.env
└── production.env
```

## Configuración por Consorcio

Algunos consorcios pueden tener configuraciones específicas:

```yaml
consorcios:
  torres_coto:
    id: "TC-001"
    urgencias_24h: true
    require_dual_signature: true
    expense_day: 1

  pedro_mendoza:
    id: "PM-002"
    urgencias_24h: false
    expense_day: 5
```

## Feature Flags

Control de funcionalidades en diferentes ambientes:

```yaml
features:
  ai_auto_response:
    enabled: true
    rollout_percentage: 100

  predictive_maintenance:
    enabled: false
    beta_consorcios: ["TC-001", "PM-002"]

  auto_budget_approval:
    enabled: true
    threshold: 10000  # ARS
```
