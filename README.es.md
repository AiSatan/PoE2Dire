[🇬🇧 English](README.md) ·
[🇧🇷 Português](README.pt-br.md) ·
[🇷🇺 Русский](README.ru.md) ·
[🇹🇭 ไทย](README.th.md) ·
[🇩🇪 Deutsch](README.de.md) ·
[🇫🇷 Français](README.fr.md) ·
🇪🇸 Español ·
[🇯🇵 日本語](README.ja.md)

> [!IMPORTANT]
> **Esta traducción se ha generado automáticamente y no ha sido revisada por un hablante nativo.**
> Puede contener errores e imprecisiones. El original en inglés: [README.md](README.md).
> Se agradece cualquier ayuda para mejorarla: ¡abre un PR o un issue!

> [!NOTE]
> PoE2Dire es un proyecto no oficial hecho por fans. No está afiliado ni asociado a Grinding Gear Games ni a Path of Exile, ni cuenta con su respaldo o patrocinio.

# PoE2Dire

Extensión para mostrar las notas de parche de Path of Exile (1 y 2) con un diseño al estilo de Dota 2.
[Basada en este hilo de Reddit](https://www.reddit.com/r/PathOfExile2/comments/1tkazjr/can_someone_explain_to_me_why_ggg_doesnt_present/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button).

[Hilo de Reddit](https://www.reddit.com/r/PathOfExile2/comments/1toxfei/dota2_style_patch_notes_browser_extension/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button) sobre la extensión en el subreddit de Path of Exile 2.

<img width="1539" height="1157" alt="preview_update" src="https://github.com/user-attachments/assets/e5e48c44-386b-4df3-8ae6-9d21aa8b9f43" />
<img width="1201" height="1021" alt="showcase" src="https://github.com/user-attachments/assets/c41b4e58-084c-4a46-969e-76e239129df7" />


La extensión solo se ejecuta en:

```text
https://www.pathofexile.com/forum/*
https://br.pathofexile.com/forum/*
https://ru.pathofexile.com/forum/*
https://th.pathofexile.com/forum/*
https://de.pathofexile.com/forum/*
https://fr.pathofexile.com/forum/*
https://es.pathofexile.com/forum/*
https://jp.pathofexile.com/forum/*
```

También solicita acceso a `poewiki.net` y `poe2wiki.net` para obtener descripciones e imágenes.


## ¿Cómo se usa?

0. Instálala para tu navegador: [Chrome](https://chromewebstore.google.com/detail/paekoknkbpfidmpabiikofkemegpfgnh?utm_source=item-share-cb)/[Firefox](https://addons.mozilla.org/en-US/firefox/addon/poe2dire/)
1. Abre cualquier página de notas de parche del foro de Path of Exile ([esta está de moda ahora](https://www.pathofexile.com/forum/view-thread/3932540))
2. Haz clic en el icono de PoE2Dire arriba para activarla <img width="114" height="79" alt="image" src="https://github.com/user-attachments/assets/2b800f16-d7a4-4f35-b4cc-65940e61ee31" /> (si no lo ves, tienes que anclarlo: pulsa el icono de mosaico, búscalo ahí y haz clic)
3. Listo
4. Puedes volver a hacer clic para desactivarla, o simplemente recargar la página.

Ejemplo en vídeo: [https://www.youtube.com/watch?v=ES66rQrVNQY](https://www.youtube.com/watch?v=ES66rQrVNQY)


## Características

- Empieza a escribir para abrir la búsqueda: solo teclea tu palabra clave, nada más.
- Índice propio: ¡bonito y fácil de usar!
- Descripción de objetos y habilidades al pasar el ratón: ¿no recuerdas qué hace ese objeto único? ¡Pasa el ratón por encima y consulta la descripción del wiki!
- Descripción de palabras clave al pasar el ratón: ¿eres nuevo y solo llevas 5000 horas de juego? Tranquilo: pasa el ratón por palabras desconocidas como «aggregated» y descubre qué significan. (se basa en la página de palabras clave de poewiki, así que solo para PoE; jugadores de PoE2, no os agobiéis por ahora)

## Opciones de instalación


> por favor, deja una reseña para que más gente la encuentre.


### Instalación en Chrome

[Chrome WebStore](https://chromewebstore.google.com/detail/paekoknkbpfidmpabiikofkemegpfgnh?utm_source=item-share-cb)

### Instalación en Firefox (también funciona en Firefox móvil)

[Página de complementos de Firefox](https://addons.mozilla.org/en-US/firefox/addon/poe2dire/)

### Instalación como userscript

> [!CAUTION]
> Esto es para quienes ya saben qué es un userscript

Supongo que ya sabes cómo instalar un script en tu «monkey». Puedes descargar `PoE2Dire.user.js` desde la página de [GitHub Releases](https://github.com/aisatan/PoE2Dire/releases). Aquí tienes un ejemplo en vídeo para ViolentMonkey: [https://www.youtube.com/watch?v=cgWVGSAxoEY](https://www.youtube.com/watch?v=cgWVGSAxoEY)

> Se rumorea: «Puedes enlazar directamente al .js en bruto desde la página de instalación».

En resumen, funciona así:

1. Descarga el archivo `PoE2Dire.user.js` desde [GitHub Releases](https://github.com/aisatan/PoE2Dire/releases).
2. Abre el archivo `PoE2Dire.user.js` de la release.
3. Instálalo en tu gestor de userscripts.
4. En una página de notas de parche del foro de Path of Exile, abre el menú del gestor de userscripts y pulsa `Toggle PoE2Dire`.

Solo lo he probado en Firefox con Tampermonkey y ViolentMonkey. Si no te funciona, abre un issue sin problema.


### ¿Es que no tenéis teléfonos?

Esto es para teléfonos o navegadores donde no puedes o no quieres instalar la extensión.

> [!NOTE]
> Algunos navegadores móviles bloquean los scripts de marcadores (bookmarklets), así que puede que no funcione para todo el mundo. Probado en `Android` con `Brave`. Si no te funciona, abre un issue: quizá alguien tenga una solución para tu caso.

> [!CAUTION]
> Esto descarga código remoto (`https://aisatan.github.io/PoE2Dire/PoE2Dire-bookmarklet.js`) y lo **ejecuta** en tu navegador.
> No es obligatorio, pero **recomiendo encarecidamente** usar el **modo incógnito** por seguridad.

Vídeo de la instalación en mi teléfono (navegador Brave):

https://github.com/user-attachments/assets/a034d803-7d16-443c-8e9b-e5f683d9e309

mejor calidad: https://youtube.com/shorts/AmYBZYfP4YY

El bookmarklet para el móvil carga la compilación de archivo único publicada en GitHub Pages:

```js
javascript:(function(){var s=document.createElement('script');s.src='https://aisatan.github.io/PoE2Dire/PoE2Dire-bookmarklet.js?poe2dire=' + Date.now();s.referrerPolicy='no-referrer';s.onerror=function(){alert('PoE2Dire failed to load. The page may block bookmarklet scripts.');};document.documentElement.appendChild(s);})();
```

Cómo usarlo:

1. Crea un marcador en el navegador (sirve cualquier sitio web)
2. Edita la URL y el nombre del marcador.
3. Pega todo el código `javascript:` de arriba como URL del marcador.
4. Ponle un nombre fácil de escribir, por ejemplo `0000 poe2dire`
5. Abre una página de notas de parche del foro de Path of Exile.
6. Ejecuta el marcador (en la mayoría de navegadores basta con escribir su nombre para encontrarlo y activarlo)


## ¿No te funciona?

Abre un issue en GitHub sin problema. Haré lo posible por arreglarlo, pero no prometo nada.


## Contribuir

No dudes en preguntar, abrir un PR, un issue o hacer un fork si quieres.
Falta documentación, pero el código JS, aunque desordenado, debería ser lo bastante claro de seguir.
Eso sí, ten en cuenta que mis décadas escribiendo JS a lo bruto pueden resultar extrañas, porque nunca lo he usado para un proyecto en condiciones, solo para scripts con jQuery.


## Apoyar 🌠

Considera cualquiera de estas pequeñas formas de apoyo:

⭐ Deja una estrella en GitHub ⭐

☕ [Invítame a un café <3](https://buymeacoffee.com/aisatan) ☕

<img width="32" height="32" alt="blender_emoji_transparent_32" src="https://github.com/user-attachments/assets/02ac03f9-3dd0-4674-8ea2-03b38e0e1f81" />[Donar a la Blender Foundation](https://fund.blender.org/donate-once/)
<img width="32" height="32" alt="blender_emoji_transparent_32" src="https://github.com/user-attachments/assets/1e6fa180-211d-4658-9b4f-c549a336a75e" />
