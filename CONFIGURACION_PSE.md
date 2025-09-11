# Configuración de Pagos PSE con PayU

## Descripción
Este sistema integra pagos PSE (Pagos Seguros en Línea) usando PayU como pasarela de pagos.

## Configuración Requerida

### 1. Variables de Entorno
Configura estas variables en Railway Dashboard:

```env
# PSE Payment Configuration (PayU)
PAYU_API_KEY=tu-api-key-de-payu
PAYU_MERCHANT_ID=tu-merchant-id-de-payu
PAYU_ACCOUNT_ID=tu-account-id-de-payu
PAYU_BASE_URL=https://api.payulatam.com/payments-api/4.0/service.cgi
PAYU_TEST_MODE=true
```

### 2. Obtener Credenciales de PayU

1. **Registrarse en PayU:**
   - Ve a https://www.payulatam.com/
   - Crea una cuenta de comercio
   - Solicita activación de PSE

2. **Obtener Credenciales:**
   - **API Key**: Se encuentra en el panel de PayU > Configuración > API
   - **Merchant ID**: Tu ID de comercio
   - **Account ID**: ID de la cuenta bancaria

### 3. Configuración de Webhooks

1. **URL del Webhook:**
   ```
   https://tu-app.railway.app/api/payments/webhook
   ```

2. **Configurar en PayU:**
   - Ve a Configuración > Webhooks
   - Agrega la URL del webhook
   - Selecciona eventos: "Pago aprobado", "Pago rechazado"

## Estados de Pago

### Estados Posibles:
- **pending**: Pago pendiente
- **paid**: Pago exitoso
- **failed**: Pago fallido

### Estados de Pedidos:
- **pending_payment**: Esperando pago
- **confirmed**: Pago confirmado
- **delivered**: Entregado

## Flujo de Pago

1. **Cliente selecciona PSE**
2. **Sistema crea pedido** con estado "pending_payment"
3. **Sistema crea transacción PSE** con PayU
4. **Cliente es redirigido** a la pasarela de PayU
5. **Cliente completa pago** en el banco
6. **PayU envía webhook** con resultado
7. **Sistema actualiza estado** del pedido

## APIs Disponibles

### Crear Pago PSE
```
POST /api/payments/create-pse
{
  "orderId": 123
}
```

### Webhook de Confirmación
```
POST /api/payments/webhook
{
  "state_pol": "4",
  "response_code_pol": "1",
  "reference_sale": "ORDER_123_1234567890",
  "value": "50000.00",
  "currency": "COP",
  "transaction_id": "12345678",
  "signature": "abc123..."
}
```

### Verificar Estado
```
GET /api/payments/status/:transactionId
```

## Panel de Administrador

El panel de administrador ahora muestra:
- **Método de Pago**: PSE, Contraentrega
- **Estado de Pago**: Pendiente, Pagado, Fallido
- **Referencia de Pago**: ID de transacción
- **Estado del Pedido**: Actualizado automáticamente

## Testing

### Modo Prueba
Con `PAYU_TEST_MODE=true`:
- Usa datos de prueba de PayU
- No se procesan pagos reales
- Ideal para desarrollo

### Datos de Prueba
- **Tarjeta**: 4111111111111111
- **CVV**: 123
- **Fecha**: Cualquier fecha futura

## Monitoreo

### Logs Importantes
- Creación de pagos PSE
- Respuestas de webhooks
- Errores de integración

### Verificar Pagos
- Revisar panel de PayU
- Verificar webhooks recibidos
- Monitorear estados en base de datos

## Solución de Problemas

### Webhook no llega
1. Verificar URL configurada en PayU
2. Verificar que la app esté accesible
3. Revisar logs del servidor

### Pago no se actualiza
1. Verificar firma del webhook
2. Revisar logs de procesamiento
3. Verificar estado en PayU

### Error de credenciales
1. Verificar variables de entorno
2. Confirmar credenciales en PayU
3. Verificar modo de prueba vs producción
