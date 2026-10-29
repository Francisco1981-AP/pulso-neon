# Pulso Neon

Juego web de reflejos, pensado primero para navegador móvil. No requiere cuentas, dependencias ni servicios de pago.

## Cómo probarlo
1. Descomprime la carpeta.
2. Abre `index.html` en un navegador moderno. El juego funciona como página estática; algunas funciones de PWA requieren servirlo por HTTPS o localhost.
3. Pulsa **Jugar ahora**. Toca los objetivos verdes y evita los rojos.
4. El récord se guarda en el almacenamiento local del navegador de ese dispositivo.

## Cómo publicarlo gratis para probarlo online
Puedes alojar los archivos estáticos en GitHub Pages o Cloudflare Pages con sus planes gratuitos (comprueba sus condiciones vigentes).
- Sube el contenido de esta carpeta a un repositorio.
- Activa Pages en la configuración del repositorio.
- Abre la URL HTTPS generada desde el móvil.

## Qué incluye
- Diseño adaptable a móvil y escritorio.
- Rondas de 30 segundos.
- Objetivos verdes (+10), rojos (-15) y penalización por objetivos que desaparecen (-2).
- Dificultad progresiva, sonido con interruptor y récord local.
- Compartir resultado con la función nativa del navegador cuando está disponible.
- Manifest para facilitar la instalación como acceso directo/PWA en navegadores compatibles.

## Limitaciones de esta primera versión
- No incluye anuncios ni compras.
- El récord se guarda solo en el navegador/dispositivo; no hay tabla global.
- La fuente web puede requerir conexión, pero se usan fuentes de sistema como alternativa.
- El archivo `manifest.webmanifest` no garantiza que todos los navegadores permitan instalar la app desde un archivo local.

## Siguientes mejoras posibles
1. Añadir pausa y opción de accesibilidad.
2. Ajustar el equilibrio de dificultad con pruebas reales.
3. Crear iconos PNG y capturas para publicación.
4. Si hay usuarios, evaluar un proveedor de anuncios y revisar privacidad/consentimiento antes de activarlos.
