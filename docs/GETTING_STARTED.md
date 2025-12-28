# Guía de Inicio Rápido

Esta guía te ayudará a configurar el proyecto localmente y comenzar a trabajar con los agentes de IA.

---

## Prerrequisitos

### Software Necesario

- **Python 3.11+**: [Descargar](https://www.python.org/downloads/)
- **Docker & Docker Compose**: [Descargar](https://www.docker.com/get-started)
- **Git**: [Descargar](https://git-scm.com/downloads)
- **Node.js 18+** (para frontend): [Descargar](https://nodejs.org/)

### Cuentas y API Keys

1. **Anthropic API Key** (para Claude)
   - Registro: https://console.anthropic.com/
   - Variable: `ANTHROPIC_API_KEY`

2. **OpenAI API Key** (opcional, para GPT-4)
   - Registro: https://platform.openai.com/
   - Variable: `OPENAI_API_KEY`

3. **Pinecone** (Vector Database)
   - Registro: https://www.pinecone.io/
   - Variables: `PINECONE_API_KEY`, `PINECONE_ENVIRONMENT`

4. **Twilio** (WhatsApp & SMS)
   - Registro: https://www.twilio.com/
   - Variables: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`

5. **SendGrid** (Email)
   - Registro: https://sendgrid.com/
   - Variable: `SENDGRID_API_KEY`

---

## Instalación Local

### 1. Clonar el Repositorio

```bash
git clone https://github.com/julioarielfernandez/claude-ai-team.git
cd claude-ai-team
```

### 2. Configurar Variables de Entorno

```bash
# Copiar template de configuración
cp .env.template .env

# Editar .env con tus credenciales
nano .env  # o usa tu editor favorito
```

**Contenido de `.env`:**
```bash
# Environment
ENVIRONMENT=development
DEBUG=true
LOG_LEVEL=INFO

# AI Services
ANTHROPIC_API_KEY=sk-ant-xxxxx
OPENAI_API_KEY=sk-xxxxx

# Vector Database
PINECONE_API_KEY=xxxxx
PINECONE_ENVIRONMENT=us-east-1
PINECONE_INDEX_NAME=knowledge_base

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/consorcios_db

# Redis
REDIS_URL=redis://localhost:6379

# RabbitMQ
RABBITMQ_URL=amqp://guest:guest@localhost:5672

# Communication APIs
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_WHATSAPP_NUMBER=+14155238886
SENDGRID_API_KEY=SG.xxxxx

# Payment Systems
INTERFAST_API_KEY=xxxxx
INTERFAST_BASE_URL=https://api.interfast.com.ar

# Storage
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_S3_BUCKET=consorcios-documents
AWS_REGION=us-east-1
```

### 3. Instalar Dependencias con Docker

**Opción A: Docker Compose (Recomendado)**

```bash
# Levantar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

**Opción B: Instalación Local**

```bash
# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Instalar servicios externos (PostgreSQL, Redis, RabbitMQ)
# Ver sección "Servicios Externos" más abajo
```

### 4. Inicializar Base de Datos

```bash
# Ejecutar migraciones
python scripts/migrate_db.py

# Cargar datos de ejemplo
python scripts/seed_data.py
```

### 5. Cargar Base de Conocimiento

```bash
# Procesar y vectorizar documentos
python scripts/load_knowledge_base.py \
  --input data/knowledge_base/raw/ \
  --output data/knowledge_base/processed/

# Verificar carga exitosa
python scripts/test_vector_search.py
```

### 6. Ejecutar Agentes

**Opción A: Todos los agentes (producción-like)**
```bash
python main.py
```

**Opción B: Agente individual (desarrollo)**
```bash
# Customer Service Agent
python -m agents.customer_service.main

# Maintenance Agent
python -m agents.maintenance.main

# Financial Agent
python -m agents.financial.main
```

### 7. Probar Integración de WhatsApp

```bash
# Iniciar webhook local
python integrations/communication/whatsapp_webhook.py

# Usar ngrok para exponer puerto
ngrok http 8000

# Configurar webhook en Twilio con la URL de ngrok
# https://xxxxx.ngrok.io/webhooks/whatsapp
```

---

## Servicios Externos (sin Docker)

### PostgreSQL

```bash
# macOS
brew install postgresql@15
brew services start postgresql@15

# Linux (Ubuntu/Debian)
sudo apt-get install postgresql-15
sudo systemctl start postgresql

# Crear base de datos
createdb consorcios_db
```

### Redis

```bash
# macOS
brew install redis
brew services start redis

# Linux
sudo apt-get install redis-server
sudo systemctl start redis
```

### RabbitMQ

```bash
# macOS
brew install rabbitmq
brew services start rabbitmq

# Linux
sudo apt-get install rabbitmq-server
sudo systemctl start rabbitmq-server

# Habilitar management plugin
sudo rabbitmq-plugins enable rabbitmq_management
# Acceder a: http://localhost:15672 (guest/guest)
```

---

## Estructura del Proyecto

```
claude-ai-team/
├── agents/                   # Agentes de IA
│   ├── customer_service/
│   │   ├── main.py          # Punto de entrada
│   │   ├── prompts.py       # System prompts
│   │   └── tools.py         # Herramientas del agente
│   └── ...
├── workflows/                # Orquestación
├── integrations/             # APIs externas
├── data/                     # Datos y modelos
├── config/                   # Configuración
├── tests/                    # Tests
├── scripts/                  # Scripts de utilidad
├── docker-compose.yml        # Configuración Docker
├── requirements.txt          # Dependencias Python
└── main.py                   # Punto de entrada principal
```

---

## Primeros Pasos

### 1. Probar Customer Service Agent

```python
from agents.customer_service import CustomerServiceAgent

# Inicializar agente
agent = CustomerServiceAgent()

# Consulta de ejemplo
response = agent.process_message(
    message="¿Cuándo vence la expensa de este mes?",
    user_id="user_123",
    consorcio_id="cons_001"
)

print(response)
```

### 2. Crear un Ticket de Reclamo

```python
from workflows.ticket_management import create_ticket

ticket = create_ticket(
    consorcio_id="cons_001",
    unidad_id="unit_123",
    tipo="plomeria",
    descripcion="Pérdida de agua en cocina",
    urgencia="alta"
)

print(f"Ticket creado: {ticket.id}")
```

### 3. Generar Liquidación de Expensas

```python
from agents.financial import FinancialAgent

agent = FinancialAgent()

# Generar liquidaciones para un consorcio
result = agent.generate_expense_statements(
    consorcio_id="cons_001",
    periodo="2025-01"
)

print(f"Generadas {result.total} liquidaciones")
```

---

## Testing

### Ejecutar Tests

```bash
# Todos los tests
pytest

# Tests específicos
pytest tests/agents/test_customer_service.py

# Con coverage
pytest --cov=agents tests/
```

### Tests de Integración

```bash
# Requiere servicios externos ejecutándose
pytest tests/integration/

# Con Docker
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

---

## Debugging

### Logs

```bash
# Ver logs de un agente específico
tail -f logs/customer_service.log

# Logs de todos los agentes
tail -f logs/*.log
```

### Debug Mode

```python
# Activar logging detallado
import logging
logging.basicConfig(level=logging.DEBUG)

# O en .env
LOG_LEVEL=DEBUG
```

---

## Próximos Pasos

1. **Leer la documentación de arquitectura**: `docs/ARCHITECTURE.md`
2. **Explorar los agentes**: `agents/README.md`
3. **Revisar workflows**: `workflows/README.md`
4. **Configurar integraciones**: `integrations/README.md`

---

## Problemas Comunes

### Error: "API Key inválida"
- Verificar que las API keys en `.env` sean correctas
- Revisar que el archivo `.env` esté en el directorio raíz

### Error: "No se puede conectar a PostgreSQL"
- Verificar que PostgreSQL esté ejecutándose: `pg_isready`
- Revisar credenciales en `DATABASE_URL`

### Error: "Pinecone index not found"
- Crear el index en Pinecone console
- Ejecutar `python scripts/create_pinecone_index.py`

### Error: "WhatsApp webhook no recibe mensajes"
- Verificar que ngrok esté ejecutándose
- Confirmar webhook configurado en Twilio

---

## Soporte

Para ayuda adicional:
- **Issues**: https://github.com/julioarielfernandez/claude-ai-team/issues
- **Email**: info@julioarielfernandez.com.ar
- **WhatsApp**: +54 9 11 5263-3707

---

**¡Listo para empezar! 🚀**
