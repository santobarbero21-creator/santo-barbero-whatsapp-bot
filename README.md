# Santo Barbero - WhatsApp Bot

Bot automatizado para responder mensajes de WhatsApp 24/7.

## Despliegue en Railway

### Paso 1: Crear cuenta en Railway
1. Ve a [railway.app](https://railway.app)
2. Click "Login" â†’ Usa tu cuenta de GitHub

### Paso 2: Crear nuevo proyecto
1. Click "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Conecta tu repositorio (o usa "Empty Project")

### Paso 3: Subir cÃ³digo
Si usas Empty Project:
1. Instala Railway CLI: `npm install -g @railway/cli`
2. En la carpeta `whatsapp-bot`, ejecuta:
   ```
   railway login
   railway init
   railway up
   ```

### Paso 4: Escanear QR
1. Ve a Railway â†’ Tu proyecto â†’ Logs
2. VerÃ¡s un cÃ³digo QR
3. EscanÃ©alo con WhatsApp (cÃ¡mara del chat)
4. Â¡Listo! El bot estÃ¡ conectado

## Comandos del Bot

| Mensaje | Respuesta |
|---------|-----------|
| Hola, Menu | MenÃº principal |
| 1, Servicios | Lista de precios |
| 2, Cita | Inicia reserva |
| 3, UbicaciÃ³n | DirecciÃ³n |
| 4, Horarios | Horario de atenciÃ³n |

## Flujo de Reserva

1. Usuario escribe "2" o "cita"
2. Bot muestra servicios â†’ Usuario elige
3. Bot pide nombre â†’ Usuario responde
4. Bot pide fecha â†’ Usuario escribe (hoy, maÃ±ana, lunes, 15 enero)
5. Bot pide hora â†’ Usuario escribe (10am, 3pm)
6. Bot muestra resumen â†’ Usuario confirma SI/NO
7. Â¡Cita agendada!

## Variables de Entorno

No se requieren variables de entorno. El bot usa autenticaciÃ³n local.

## Mantenimiento

- El bot se reconecta automÃ¡ticamente si se desconecta
- Los logs muestran todas las citas agendadas
- Para reconectar manualmente, reinicia el servicio en Railway
