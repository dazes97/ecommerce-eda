# E-commerce Platform (ecommerce-platform)

**Repositorio y Organización del Código**

Este README describe la estructura de carpetas, la justificación de cada componente, las convenciones de nomenclatura y el enfoque Event-Driven Architecture (EDA) aplicado a esta plataforma de e-commerce.

---

## 1. Estructura de Carpetas

```text
ecommerce-platform/
├── README.md                     # Documentación y guía de arranque
├── package.json                  # Dependencias y scripts (monorepo o raíz)
├── .env.example                  # Variables de entorno de ejemplo
├── docker-compose.yml            # Servicios locales: RabbitMQ, MySQL, Redis, mocks y microservicios
├── k8s/                          # Manifiestos Kubernetes para producción (Deployment, Service, HPA)
├── events/                       # Contratos de eventos y cliente genérico
│   ├── index.js                  # Publish/Subscribe genérico de eventos
│   └── schemas/                  # JSON Schemas: userRegistered.json, productAdded.json, cartCheckedOut.json, orderFulfilled.json
├── infrastructure/               # Adaptadores y utilidades de infraestructuras externas
│   ├── broker/                   # Conexión a RabbitMQ/Kafka (rabbitmq.js)
│   ├── database/                 # Conexión a MySQL con Sequelize (mysql.js)
│   ├── cache/                    # Cliente Redis (redis.js)
│   └── external-services/        # Wrappers para servicios externos (payment-processor.js, providers.js, email.js, transportation.js, loyalty.js)
├── services/                     # Microservicios independientes con patrón hexagonal y EDA interna
│   ├── catalog/                  # Gestión de productos
│   ├── users/                    # Registro, autenticación y gestión de perfiles
│   ├── cart/                     # Carrito de compras y validaciones de stock
│   ├── checkout/                 # Cálculo de totales y generación de órdenes de pago
│   ├── orders/                   # Creación, seguimiento y estado de pedidos
│   ├── logistics/                # Coordinación de envíos y tracking
│   ├── integrations/             # Orquestación de flujos hacia servicios externos
│   └── reports/                  # Generación de estadísticas e informes basados en eventos
└── docs/
    └── ARQUITECTURA.md           # Diagramas C4, justificación y requisitos funcionales y no funcionales
```

**Justificación de Carpeta**

* `events/`: Centraliza los contratos de mensajes y evita duplicación. Garantiza consistencia en el intercambio de eventos.
* `infrastructure/`: Aíslan detalles de configuración de broker, base de datos, cache y servicios externos.
* `services/`: Cada dominio (catalog, users, cart…) es un microservicio autónomo que sigue el **patrón hexagonal** (Ports & Adapters) y reacciona o emite eventos.
* `k8s/` & `docker-compose.yml`: Facilitan orquestación local y despliegue en producción, garantizando **Availability** y **Elasticity**.
* `docs/`: Reúne toda la documentación de arquitectura, diagramas y justificaciones.

---

## 2. Convenciones de Nomenclatura

* **Directorios**: `kebab-case` (minúsculas y guiones). Ej.: `external-services`, `payment-processor`.
* **Clases / Entidades**: `PascalCase`. Ej.: `Product.js`, `OrderRepository.js`.
* **Módulos, Controladores, Casos de Uso, Adaptadores**: `kebab-case`. Ej.: `catalog-controller.js`, `process-payment-use-case.js`, `mysql-product-repository.js`, `rabbitmq-client.js`.
* **Punto de entrada**: siempre `index.js` en cada módulo.
* **Manifiestos YAML**: `kebab-case`. Ej.: `catalog-deployment.yaml`, `users-service.yaml`.
* **Schemas JSON**: `camelCase` o `kebab-case`. Ej.: `userRegistered.json`, `cart-checked-out.json`.
* **Tests**: `kebab-case.spec.js`. Ej.: `cart.spec.js`, `checkout-use-case.spec.js`.

---

## 3. Tecnologías y Herramientas

* **Node.js & Express**: Runtime y framework HTTP.
* **RabbitMQ / Kafka**: Message Broker para EDA.
* **MySQL + Sequelize**: Base de datos relacional y ORM.
* **Redis**: Cache para datos de lectura intensiva.
* **Docker & Docker Compose**: Desarrollo local y pruebas.
* **Kubernetes (k8s)**: Producción con HPA, health checks y despliegue por microservicio.
* **JSON Schema**: Definición y validación de eventos.

---

## 4. Event-Driven Architecture (EDA)

Este proyecto adopta **EDA** para desacoplar componentes, mejorar la escalabilidad y la resiliencia:

1. **Productores y consumidores de eventos**:

   * Cada microservicio publica eventos tras completar un caso de uso (e.g. `cart.checkedOut`).
   * Otros servicios reaccionan a esos eventos de forma asíncrona.
2. **Desacoplamiento extremo**:

   * Un cambio en la lógica de pagos no afecta al servicio de catálogo si se mantiene el contrato de evento.
3. **Escalado independiente**:

   * Kubernetes escala microservicios según métricas (CPU, longitudes de cola).
4. **Resiliencia y tolerancia a fallos**:

   * Retries y circuit breakers en adaptadores a servicios externos.
   * Fallos parciales no afectan al flujo global.

**Ventajas y Beneficios**

* **Performance**: procesamiento paralelo de eventos, caché en Redis y escalado granular.
* **Availability**: réplicas de servicios, health checks y despliegues sin downtime.
* **Elasticity**: HPA ajusta instancias según demanda.
* **Mantenibilidad**: módulos independientes y lógica de dominio protegida.
* **Extensibilidad**: fácil incorporación de nuevos servicios o integraciones.

---
