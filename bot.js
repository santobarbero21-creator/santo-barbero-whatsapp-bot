/**
 * Santo Barbero - WhatsApp Bot
 * Bot automatizado usando whatsapp-web.js
 */

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

// Servidor Express para mantener vivo el proceso
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json({
        status: 'Bot Santo Barbero activo',
        connected: client.info ? true : false
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`ðŸŒ Servidor web en puerto ${PORT}`);
});

// ConfiguraciÃ³n del cliente WhatsApp
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './session'
    }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ]
    }
});

// Servicios disponibles
const SERVICES = {
    '1': { name: 'Corte Moderno', price: 150 },
    '2': { name: 'Corte ClÃ¡sico', price: 120 },
    '3': { name: 'Arreglo de Barba', price: 80 },
    '4': { name: 'Cejas', price: 50 },
    '5': { name: 'Combo Completo', price: 250 },
    '6': { name: 'Tratamiento Capilar', price: 100 }
};

// Estado de conversaciones
const conversationState = {};

// Evento: Generar QR
client.on('qr', (qr) => {
    console.log('\nðŸ“± Escanea este cÃ³digo QR con WhatsApp:\n');
    qrcode.generate(qr, { small: true });
});

// Evento: Autenticado
client.on('authenticated', () => {
    console.log('âœ… AutenticaciÃ³n exitosa');
});

// Evento: Listo
client.on('ready', () => {
    console.log('ðŸš€ Bot Santo Barbero estÃ¡ listo!');
    console.log('ðŸ“± NÃºmero conectado:', client.info.wid.user);
});

// Evento: Mensaje recibido
client.on('message', async (message) => {
    // Ignorar mensajes de grupos y broadcasts
    if (message.from.includes('@g.us') || message.from === 'status@broadcast') {
        return;
    }

    const from = message.from;
    const text = message.body.toLowerCase().trim();

    console.log(`ðŸ“© Mensaje de ${from}: ${text}`);

    try {
        const response = processMessage(from, text);
        if (response) {
            await message.reply(response);
            console.log(`ðŸ“¤ Respuesta enviada a ${from}`);
        }
    } catch (error) {
        console.error('Error procesando mensaje:', error);
    }
});

// Evento: Desconectado
client.on('disconnected', (reason) => {
    console.log('âŒ Bot desconectado:', reason);
    // Intentar reconectar
    client.initialize();
});

// Procesar mensaje y generar respuesta
function processMessage(from, text) {
    // Obtener estado de la conversaciÃ³n
    const state = conversationState[from] || { step: 'menu' };

    // Comandos de reinicio
    const menuKeywords = ['menu', 'inicio', 'hola', 'hi', 'hello', 'buenos dias',
        'buenas tardes', 'buenas noches', 'buen dia', 'que tal'];

    if (menuKeywords.some(keyword => text.includes(keyword))) {
        conversationState[from] = { step: 'menu' };
        return getMainMenu();
    }

    // Procesar segÃºn el estado actual
    switch (state.step) {
        case 'menu':
            return handleMenuSelection(from, text);

        case 'booking_service':
            return handleServiceSelection(from, text);

        case 'booking_name':
            return handleNameInput(from, text);

        case 'booking_date':
            return handleDateSelection(from, text);

        case 'booking_time':
            return handleTimeSelection(from, text);

        case 'booking_confirm':
            return handleConfirmation(from, text);

        default:
            conversationState[from] = { step: 'menu' };
            return getMainMenu();
    }
}

// MenÃº principal
function getMainMenu() {
    return `Â¡Hola! ðŸ‘‹ Bienvenido a *Santo Barbero* ðŸ’ˆ

Somos la barberÃ­a premium de Caucel, MÃ©rida.

Â¿QuÃ© deseas hacer?

1ï¸âƒ£ Ver servicios y precios
2ï¸âƒ£ Agendar una cita
3ï¸âƒ£ UbicaciÃ³n
4ï¸âƒ£ Horarios

Responde con el nÃºmero de tu opciÃ³n.`;
}

// Manejar selecciÃ³n del menÃº principal
function handleMenuSelection(from, text) {
    switch (text) {
        case '1':
        case 'servicios':
        case 'precios':
            return getServicesMessage();

        case '2':
        case 'cita':
        case 'agendar':
        case 'reservar':
            conversationState[from] = { step: 'booking_service' };
            return getBookingServiceMessage();

        case '3':
        case 'ubicacion':
        case 'donde':
        case 'direccion':
            return getLocationMessage();

        case '4':
        case 'horario':
        case 'horarios':
            return getScheduleMessage();

        default:
            return `No entendÃ­ tu mensaje. ðŸ¤”

Responde con un nÃºmero del *1 al 4*:

1ï¸âƒ£ Servicios y precios
2ï¸âƒ£ Agendar cita
3ï¸âƒ£ UbicaciÃ³n
4ï¸âƒ£ Horarios

O escribe *menu* para ver las opciones.`;
    }
}

// Mensaje de servicios
function getServicesMessage() {
    return `ðŸ’ˆ *SERVICIOS SANTO BARBERO* ðŸ’ˆ

âœ‚ï¸ *Corte Moderno* - $150
Fade, skin fade, texturas y estilos de tendencia.

âœ‚ï¸ *Corte ClÃ¡sico* - $120
Estilo tradicional con tÃ©cnicas de barberÃ­a clÃ¡sica.

ðŸ§” *Arreglo de Barba* - $80
Perfilado, delineado y tratamiento premium.

ðŸ‘ï¸ *Cejas* - $50
DiseÃ±o y depilaciÃ³n profesional.

â­ *Combo Completo* - $250
Corte + Barba + Cejas + Tratamiento.

ðŸ’† *Tratamiento Capilar* - $100
HidrataciÃ³n y masaje capilar.

---
ðŸ“… Â¿Quieres agendar? Escribe *2* o *cita*`;
}

// Mensaje de ubicaciÃ³n
function getLocationMessage() {
    return `ðŸ“ *UBICACIÃ“N SANTO BARBERO*

Calle 117F Diagonal, No. 793, Depto 31
Fracc. Herradura Poniente
Caucel, MÃ©rida, YucatÃ¡n

ðŸŒ santobarbero.com.mx

ðŸ“± Escribe *2* para agendar una cita
ðŸ“‹ Escribe *menu* para volver al inicio`;
}

// Mensaje de horarios
function getScheduleMessage() {
    return `ðŸ• *HORARIO SANTO BARBERO*

ðŸ“… *Lunes a SÃ¡bado*
â° 9:00 AM - 8:00 PM

ðŸš« *Domingos:* Cerrado

---
ðŸ“… Â¿Quieres agendar? Escribe *2* o *cita*`;
}

// Flujo de reserva - SelecciÃ³n de servicio
function getBookingServiceMessage() {
    return `ðŸ“… *AGENDAR CITA*

Â¿QuÃ© servicio necesitas?

1ï¸âƒ£ Corte Moderno - $150
2ï¸âƒ£ Corte ClÃ¡sico - $120
3ï¸âƒ£ Arreglo de Barba - $80
4ï¸âƒ£ Cejas - $50
5ï¸âƒ£ Combo Completo - $250
6ï¸âƒ£ Tratamiento Capilar - $100

Responde con el nÃºmero del servicio.

(Escribe *menu* para cancelar)`;
}

function handleServiceSelection(from, text) {
    if (text === 'menu' || text === 'cancelar') {
        conversationState[from] = { step: 'menu' };
        return getMainMenu();
    }

    const service = SERVICES[text];

    if (!service) {
        return `Por favor selecciona un nÃºmero del *1 al 6*.

O escribe *menu* para cancelar.`;
    }

    conversationState[from] = {
        step: 'booking_name',
        service: service.name,
        price: service.price
    };

    return `âœ‚ï¸ *${service.name}* seleccionado. ($${service.price})

Â¿CuÃ¡l es tu nombre?`;
}

function handleNameInput(from, text) {
    if (text === 'menu' || text === 'cancelar') {
        conversationState[from] = { step: 'menu' };
        return getMainMenu();
    }

    if (text.length < 2) {
        return `Por favor escribe tu nombre completo.`;
    }

    const state = conversationState[from];
    conversationState[from] = {
        ...state,
        step: 'booking_date',
        name: text.charAt(0).toUpperCase() + text.slice(1)
    };

    return `ðŸ‘‹ Gracias *${conversationState[from].name}*!

Â¿QuÃ© dÃ­a prefieres?

Ejemplos:
â€¢ hoy
â€¢ maÃ±ana
â€¢ lunes
â€¢ 15 enero

(Escribe *menu* para cancelar)`;
}

function handleDateSelection(from, text) {
    if (text === 'menu' || text === 'cancelar') {
        conversationState[from] = { step: 'menu' };
        return getMainMenu();
    }

    const date = parseDate(text);

    if (!date) {
        return `No entendÃ­ la fecha. ðŸ¤”

Por favor escribe algo como:
â€¢ *hoy*
â€¢ *maÃ±ana*
â€¢ *lunes*
â€¢ *15 enero*`;
    }

    const state = conversationState[from];
    conversationState[from] = {
        ...state,
        step: 'booking_time',
        date: date.formatted,
        dateObj: date.date
    };

    return `ðŸ“… Fecha: *${date.formatted}*

Â¿A quÃ© hora? â°
Nuestro horario es *9AM - 8PM*

Ejemplos: 10am, 3pm, 15:00`;
}

function handleTimeSelection(from, text) {
    if (text === 'menu' || text === 'cancelar') {
        conversationState[from] = { step: 'menu' };
        return getMainMenu();
    }

    const time = parseTime(text);

    if (!time) {
        return `Por favor escribe una hora vÃ¡lida. â°

Ejemplos:
â€¢ 10am
â€¢ 3pm
â€¢ 15:00

Horario: 9AM - 8PM`;
    }

    const state = conversationState[from];
    conversationState[from] = {
        ...state,
        step: 'booking_confirm',
        time: time
    };

    return `âœ… *CONFIRMAR CITA*

ðŸ‘¤ Nombre: *${state.name}*
ðŸ“‹ Servicio: *${state.service}*
ðŸ“… Fecha: *${state.date}*
ðŸ• Hora: *${time}*
ðŸ’° Precio: *$${state.price} MXN*

Â¿Confirmas tu cita?
Responde *SI* o *NO*`;
}

function handleConfirmation(from, text) {
    if (text === 'menu' || text === 'cancelar' || text === 'no') {
        conversationState[from] = { step: 'menu' };
        return `âŒ Cita cancelada.

Escribe *2* para agendar de nuevo o *menu* para ver opciones.`;
    }

    if (text === 'si' || text === 'sÃ­' || text === 'yes' || text === 'confirmar' || text === 'ok') {
        const state = conversationState[from];

        // Log de la cita (en producciÃ³n guardar en base de datos)
        console.log('ðŸ“… NUEVA CITA:', {
            cliente: state.name,
            telefono: from,
            servicio: state.service,
            fecha: state.date,
            hora: state.time,
            precio: state.price
        });

        conversationState[from] = { step: 'menu' };

        return `ðŸŽ‰ *Â¡CITA CONFIRMADA!*

ðŸ‘¤ *${state.name}*
ðŸ“‹ ${state.service}
ðŸ“… ${state.date}
ðŸ• ${state.time}
ðŸ’° $${state.price} MXN

ðŸ“ *UbicaciÃ³n:*
Calle 117F Diagonal #793
Fracc. Herradura, Caucel

âš ï¸ Te esperamos puntual.
Si necesitas cancelar, escrÃ­benos con anticipaciÃ³n.

Â¡Gracias por elegir *Santo Barbero*! ðŸ’ˆâœ¨`;
    }

    return `Por favor responde *SI* para confirmar o *NO* para cancelar.`;
}

// Funciones auxiliares para parsear fecha y hora
function parseDate(text) {
    const today = new Date();
    const days = ['domingo', 'lunes', 'martes', 'miercoles', 'miÃ©rcoles', 'jueves', 'viernes', 'sabado', 'sÃ¡bado'];
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    text = text.toLowerCase().trim();

    if (text === 'hoy') {
        return { date: today, formatted: formatDate(today) };
    }

    if (text === 'maÃ±ana' || text === 'manana') {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return { date: tomorrow, formatted: formatDate(tomorrow) };
    }

    // DÃ­a de la semana
    let dayIndex = days.indexOf(text);
    if (dayIndex === -1 && text === 'miercoles') dayIndex = 3;
    if (dayIndex === -1 && text === 'sabado') dayIndex = 6;

    if (dayIndex !== -1) {
        if (dayIndex > 6) dayIndex = dayIndex === 7 ? 3 : 6; // Handle accented versions
        const targetDate = new Date(today);
        const currentDay = today.getDay();
        let daysToAdd = dayIndex - currentDay;
        if (daysToAdd <= 0) daysToAdd += 7;
        targetDate.setDate(today.getDate() + daysToAdd);
        return { date: targetDate, formatted: formatDate(targetDate) };
    }

    // Formato "15 enero" o "15 de enero"
    const match = text.match(/(\d{1,2})\s*(?:de\s*)?(\w+)/);
    if (match) {
        const day = parseInt(match[1]);
        const monthName = match[2].toLowerCase();
        const monthIndex = months.indexOf(monthName);
        if (monthIndex !== -1 && day >= 1 && day <= 31) {
            const targetDate = new Date(today.getFullYear(), monthIndex, day);
            if (targetDate < today) {
                targetDate.setFullYear(targetDate.getFullYear() + 1);
            }
            return { date: targetDate, formatted: formatDate(targetDate) };
        }
    }

    return null;
}

function formatDate(date) {
    const days = ['Domingo', 'Lunes', 'Martes', 'MiÃ©rcoles', 'Jueves', 'Viernes', 'SÃ¡bado'];
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    return `${days[date.getDay()]} ${date.getDate()} de ${months[date.getMonth()]}`;
}

function parseTime(text) {
    text = text.toLowerCase().trim().replace(/\s/g, '');

    // Formato 12h (10am, 3pm)
    const match12 = text.match(/^(\d{1,2})(am|pm)$/);
    if (match12) {
        let hour = parseInt(match12[1]);
        const period = match12[2];

        if (period === 'pm' && hour !== 12) hour += 12;
        if (period === 'am' && hour === 12) hour = 0;

        if (hour >= 9 && hour <= 20) {
            const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
            return `${displayHour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
        }
        return null; // Fuera de horario
    }

    // Formato 24h (15:00 o 15)
    const match24 = text.match(/^(\d{1,2}):?(\d{2})?$/);
    if (match24) {
        const hour = parseInt(match24[1]);
        if (hour >= 9 && hour <= 20) {
            const displayHour = hour > 12 ? hour - 12 : hour;
            return `${displayHour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
        }
        return null; // Fuera de horario
    }

    return null;
}

// Iniciar el cliente
console.log('ðŸš€ Iniciando Bot Santo Barbero...');
client.initialize();
