[🇬🇧 English](../README.md) ·
[🇧🇷 Português](README.pt-br.md) ·
🇷🇺 Русский ·
[🇹🇭 ไทย](README.th.md) ·
[🇩🇪 Deutsch](README.de.md) ·
[🇫🇷 Français](README.fr.md) ·
[🇪🇸 Español](README.es.md) ·
[🇯🇵 日本語](README.ja.md)

> [!IMPORTANT]
> **Этот перевод сделан машиной и не проверялся носителем языка.**
> В нём могут быть ошибки и неточности. Оригинал на английском: [README.md](../README.md).
> Будем рады помощи с улучшением перевода — открывайте PR или issue!

> [!NOTE]
> PoE2Dire — это неофициальный фанатский проект. Он не связан с Grinding Gear Games или Path of Exile, не одобрен и не спонсируется ими.

# PoE2Dire

Расширение для отображения списков изменений Path of Exile (1 и 2) в стиле Dota 2.
[Основано на этой ветке Reddit](https://www.reddit.com/r/PathOfExile2/comments/1tkazjr/can_someone_explain_to_me_why_ggg_doesnt_present/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button).

[Ветка на Reddit](https://www.reddit.com/r/PathOfExile2/comments/1toxfei/dota2_style_patch_notes_browser_extension/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button) про расширение в сабреддите Path of Exile 2.

<img width="1539" height="1157" alt="preview_update" src="https://github.com/user-attachments/assets/e5e48c44-386b-4df3-8ae6-9d21aa8b9f43" />
<img width="1201" height="1021" alt="showcase" src="https://github.com/user-attachments/assets/c41b4e58-084c-4a46-969e-76e239129df7" />


Расширение работает только на:

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

Также оно запрашивает доступ к `poewiki.net` и `poe2wiki.net` для получения описаний и изображений.


## Как пользоваться?

0. Установите для своего браузера: [Chrome](https://chromewebstore.google.com/detail/paekoknkbpfidmpabiikofkemegpfgnh?utm_source=item-share-cb)/[Firefox](https://addons.mozilla.org/en-US/firefox/addon/poe2dire/)
1. Откройте любую страницу форума Path of Exile со списком изменений ([вот эта сейчас популярна](https://www.pathofexile.com/forum/view-thread/3932540))
2. Нажмите на значок PoE2Dire сверху, чтобы включить его <img width="114" height="79" alt="image" src="https://github.com/user-attachments/assets/2b800f16-d7a4-4f35-b4cc-65940e61ee31" /> (если значка не видно, его нужно закрепить: нажмите на иконку с мозаикой, найдите его и нажмите там)
3. Готово
4. Можно нажать ещё раз, чтобы выключить, или просто перезагрузить страницу.

Пример на видео: [https://www.youtube.com/watch?v=ES66rQrVNQY](https://www.youtube.com/watch?v=ES66rQrVNQY)


## Возможности

- Начните печатать, чтобы открыть поиск — просто наберите слово, больше ничего не нужно.
- Своё оглавление — красивое и удобное!
- Описание предметов и умений при наведении — не помните, что делает этот уникальный предмет? Наведите курсор и посмотрите описание из вики!
- Описание ключевых слов при наведении — вы новичок и наиграли всего 5000 часов? Не беда: наведите курсор на непонятное слово вроде «aggregated» и посмотрите, что оно значит! (берётся со страницы ключевых слов poewiki — то есть только для PoE, игроки в PoE2, не пугайтесь пока)

## Способы установки


> пожалуйста, оставьте отзыв, чтобы расширение нашло больше людей!


### Установка в Chrome

[Chrome WebStore](https://chromewebstore.google.com/detail/paekoknkbpfidmpabiikofkemegpfgnh?utm_source=item-share-cb)

### Установка в Firefox (работает и на мобильном Firefox)

[Страница дополнений Firefox](https://addons.mozilla.org/en-US/firefox/addon/poe2dire/)

### Установка как юзерскрипт

> [!CAUTION]
> Это для тех, кто знает, что такое юзерскрипты

Надеюсь, вы уже знаете, как ставить скрипты для своей «обезьяны». Скачать `PoE2Dire.user.js` можно со страницы [GitHub Releases](https://github.com/aisatan/PoE2Dire/releases). Вот видео-пример для ViolentMonkey: [https://www.youtube.com/watch?v=cgWVGSAxoEY](https://www.youtube.com/watch?v=cgWVGSAxoEY)

> Ходят слухи: «Можно дать прямую ссылку на raw .js прямо на странице установки».

Если коротко, порядок такой:

1. Скачайте файл `PoE2Dire.user.js` со страницы [GitHub Releases](https://github.com/aisatan/PoE2Dire/releases).
2. Откройте файл `PoE2Dire.user.js` из релиза.
3. Установите его в своём менеджере юзерскриптов.
4. На странице форума Path of Exile со списком изменений откройте меню менеджера юзерскриптов и нажмите `Toggle PoE2Dire`.

Я проверял это только в Firefox с Tampermonkey и ViolentMonkey. Если у вас не работает — смело открывайте issue.


### У вас же есть телефоны?

Это для телефонов и браузеров, где нельзя или не хочется устанавливать расширение.

> [!NOTE]
> Некоторые мобильные браузеры блокируют скрипты-закладки, так что может сработать не у всех. Проверялось на `Android` в `Brave`. Если у вас не работает — открывайте issue, возможно, у кого-то найдётся решение.

> [!CAUTION]
> Это загрузит удалённый код (`https://aisatan.github.io/PoE2Dire/PoE2Dire-bookmarklet.js`) и **выполнит** его в вашем браузере.
> Это не обязательно, но я **настоятельно советую** для безопасности использовать **режим инкогнито**.

Видео установки на моём телефоне (браузер Brave):

https://github.com/user-attachments/assets/a034d803-7d16-443c-8e9b-e5f683d9e309

в лучшем качестве: https://youtube.com/shorts/AmYBZYfP4YY

Закладка для телефона загружает опубликованную однофайловую сборку с GitHub Pages:

```js
javascript:(function(){var s=document.createElement('script');s.src='https://aisatan.github.io/PoE2Dire/PoE2Dire-bookmarklet.js?poe2dire=' + Date.now();s.referrerPolicy='no-referrer';s.onerror=function(){alert('PoE2Dire failed to load. The page may block bookmarklet scripts.');};document.documentElement.appendChild(s);})();
```

Как этим пользоваться:

1. Создайте закладку в браузере (подойдёт любой сайт)
2. Отредактируйте адрес и название закладки.
3. Вставьте весь код `javascript:` сверху в поле адреса закладки.
4. Задайте простое название, например `0000 poe2dire`
5. Откройте страницу форума Path of Exile со списком изменений.
6. Запустите закладку (в большинстве браузеров можно просто набрать её название и выбрать её)


## Не работает?

Смело открывайте issue на GitHub — я постараюсь помочь, но ничего не обещаю.


## Участие в проекте

Пожалуйста, не стесняйтесь задавать вопросы, открывать PR, issue или делать форк.
Документации мало, но код на JS, пусть и неаккуратный, должен читаться достаточно понятно.
Только учтите: мои десятилетия написания хакерского JS могут выглядеть странно, ведь я никогда не делал на нём нормальных проектов — только скрипты на jQuery.


## Поддержать 🌠

Пожалуйста, рассмотрите любой из этих небольших способов поддержки:

⭐ Поставьте звезду на GitHub ⭐

☕ [Купить мне кофе <3](https://buymeacoffee.com/aisatan) ☕

<img width="32" height="32" alt="blender_emoji_transparent_32" src="https://github.com/user-attachments/assets/02ac03f9-3dd0-4674-8ea2-03b38e0e1f81" />[Пожертвовать Blender Foundation](https://fund.blender.org/donate-once/)
<img width="32" height="32" alt="blender_emoji_transparent_32" src="https://github.com/user-attachments/assets/1e6fa180-211d-4658-9b4f-c549a336a75e" />
