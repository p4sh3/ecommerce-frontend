# Punto · Frontend E-commerce

Frontend en Next.js 16 (App Router) para consumir la API REST de `ecommerce-api` (Laravel 12, JWT y Stripe).

## Configuración

Requisitos: Node.js 20.9 o posterior, npm y la API Laravel activa.

```bash
cd ecommerce-frontend
npm ci
cp .env.example .env.local
```

Configura `.env.local`:

| Variable | Uso |
| --- | --- |
| `API_BASE_URL` | URL de la API incluyendo `/api`, por ejemplo `http://127.0.0.1:8000/api` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clave publicable de Stripe (`pk_test_...` en desarrollo) |

La clave secreta de Stripe permanece en Laravel y nunca debe configurarse en este frontend. El JWT devuelto por la API se guarda en una cookie `httpOnly`, `sameSite=lax` y `secure` en producción.

## Rutas implementadas

| Ruta | Descripción | Acceso |
| --- | --- | --- |
| `/` | Catálogo público de productos | Público |
| `/products/[id]` | Detalle de producto | Público |
| `/login` | Inicio de sesión contra la API | Público |
| `/register` | Registro contra la API | Público |
| `/checkout` | Carrito, creación de orden y pago con Stripe | Requiere iniciar sesión para pagar |
| `/checkout/success` | Resultado/confirmación del pago | Retorno de Stripe |
| `/account/orders` | Historial de compras | Protegido; redirige a login si no hay sesión |

## Ejecución

Desde la raíz del workspace, abre una terminal para la API. Si Swagger aún no está generado, ejecuta primero su comando de generación:

```bash
cd ecommerce-api
php artisan l5-swagger:generate
php artisan serve --host=127.0.0.1 --port=8000
```

Para habilitar el pago local, instala Stripe CLI y, en otra terminal, inicia el forwarder:

```bash
stripe listen --events payment_intent.succeeded,payment_intent.payment_failed,payment_intent.processing,payment_intent.canceled --forward-to http://127.0.0.1:8000/api/webhooks/stripe
```

Copia el `whsec_...` que imprime Stripe CLI a `STRIPE_WEBHOOK_SECRET` en `ecommerce-api/.env`, ejecuta `php artisan config:clear` desde la carpeta de la API y reinicia Laravel. En `ecommerce-frontend/.env.local`, configura `API_BASE_URL` (incluye `/api`) y la clave publicable `pk_test_...`. En otra terminal, también desde la raíz del workspace, inicia el frontend:

```bash
cd ecommerce-frontend
npm run dev
```

Abre <http://localhost:3000>. Comprobaciones locales:

```bash
cd ecommerce-frontend
npm run lint
npm run build
```

## Validación y evidencias

Los archivos de `evidence/` contienen capturas reales de Swagger, catálogo, formulario Payment Element, historial y confirmación, además del reporte Lighthouse generado con los 12 productos de la API.