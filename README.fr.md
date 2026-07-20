[🇬🇧 English](README.md) ·
[🇧🇷 Português](README.pt-br.md) ·
[🇷🇺 Русский](README.ru.md) ·
[🇹🇭 ไทย](README.th.md) ·
[🇩🇪 Deutsch](README.de.md) ·
🇫🇷 Français ·
[🇪🇸 Español](README.es.md) ·
[🇯🇵 日本語](README.ja.md)

> [!IMPORTANT]
> **Cette traduction a été générée automatiquement et n'a pas été relue par un locuteur natif.**
> Elle peut contenir des erreurs et des imprécisions. L'original en anglais : [README.md](README.md).
> Toute aide pour l'améliorer est la bienvenue — n'hésitez pas à ouvrir une PR ou une issue !

> [!NOTE]
> PoE2Dire est un projet non officiel créé par un fan. Il n'est ni affilié, ni associé, ni approuvé, ni sponsorisé par Grinding Gear Games ou Path of Exile.

# PoE2Dire

Extension qui affiche les notes de mise à jour de Path of Exile (1 et 2) dans un style Dota 2.
[Inspirée de ce fil Reddit](https://www.reddit.com/r/PathOfExile2/comments/1tkazjr/can_someone_explain_to_me_why_ggg_doesnt_present/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button).

[Fil Reddit](https://www.reddit.com/r/PathOfExile2/comments/1toxfei/dota2_style_patch_notes_browser_extension/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button) consacré à l'extension sur le subreddit Path of Exile 2.

<img width="1539" height="1157" alt="preview_update" src="https://github.com/user-attachments/assets/e5e48c44-386b-4df3-8ae6-9d21aa8b9f43" />
<img width="1201" height="1021" alt="showcase" src="https://github.com/user-attachments/assets/c41b4e58-084c-4a46-969e-76e239129df7" />


L'extension ne s'active que sur :

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

Elle demande également l'accès à `poewiki.net` et `poe2wiki.net` pour récupérer les descriptions et les images.


## Comment l'utiliser ?

0. Installez-la pour votre navigateur : [Chrome](https://chromewebstore.google.com/detail/paekoknkbpfidmpabiikofkemegpfgnh?utm_source=item-share-cb)/[Firefox](https://addons.mozilla.org/en-US/firefox/addon/poe2dire/)
1. Ouvrez n'importe quelle page de notes de mise à jour sur le forum Path of Exile ([celle-ci est populaire en ce moment](https://www.pathofexile.com/forum/view-thread/3932540))
2. Cliquez sur l'icône PoE2Dire en haut pour l'activer <img width="114" height="79" alt="image" src="https://github.com/user-attachments/assets/2b800f16-d7a4-4f35-b4cc-65940e61ee31" /> (si vous ne la voyez pas, il faut l'épingler : cliquez sur l'icône en mosaïque, cherchez-la et cliquez dessus)
3. C'est fait
4. Vous pouvez cliquer à nouveau pour la désactiver, ou simplement recharger la page.

Exemple en vidéo : [https://www.youtube.com/watch?v=ES66rQrVNQY](https://www.youtube.com/watch?v=ES66rQrVNQY)


## Fonctionnalités

- Commencez simplement à taper pour lancer la recherche — tapez votre mot-clé, rien de plus.
- Sommaire personnalisé — joli et facile à utiliser !
- Description des objets et compétences au survol — vous ne vous souvenez plus de ce que fait cet objet unique ? Survolez-le et lisez la description du wiki !
- Description des mots-clés au survol — vous êtes nouveau avec seulement 5000 heures de jeu ? Pas de souci : survolez un mot inconnu comme « aggregated » et découvrez ce qu'il signifie ! (basé sur la page des mots-clés de poewiki — donc PoE uniquement, joueurs de PoE2 ne soyez pas trop perdus pour l'instant)

## Options d'installation


> pensez à laisser un avis, pour que plus de gens la découvrent !


### Installation sur Chrome

[Chrome WebStore](https://chromewebstore.google.com/detail/paekoknkbpfidmpabiikofkemegpfgnh?utm_source=item-share-cb)

### Installation sur Firefox (fonctionne aussi sur Firefox mobile)

[Page des modules Firefox](https://addons.mozilla.org/en-US/firefox/addon/poe2dire/)

### Installation en tant que userscript

> [!CAUTION]
> Ceci s'adresse aux personnes qui savent ce qu'est un userscript

J'espère que vous savez déjà installer un script pour votre « monkey ». Vous pouvez télécharger `PoE2Dire.user.js` depuis la page [GitHub Releases](https://github.com/aisatan/PoE2Dire/releases). Voici un exemple en vidéo pour ViolentMonkey : [https://www.youtube.com/watch?v=cgWVGSAxoEY](https://www.youtube.com/watch?v=cgWVGSAxoEY)

> La rumeur dit : « On peut mettre un lien direct vers le .js brut sur la page d'installation. »

En résumé, cela se passe ainsi :

1. Téléchargez le fichier `PoE2Dire.user.js` depuis [GitHub Releases](https://github.com/aisatan/PoE2Dire/releases).
2. Ouvrez le fichier `PoE2Dire.user.js` de la release.
3. Installez-le dans votre gestionnaire de userscripts.
4. Sur une page de notes de mise à jour du forum Path of Exile, ouvrez le menu du gestionnaire de userscripts et cliquez sur `Toggle PoE2Dire`.

Je n'ai testé cela que sur Firefox avec Tampermonkey et ViolentMonkey. Si cela ne fonctionne pas chez vous, n'hésitez pas à ouvrir une issue.


### Vous avez des téléphones, non ?

Ceci est pour les téléphones ou les navigateurs où vous ne pouvez pas ou ne voulez pas installer l'extension.

> [!NOTE]
> Certains navigateurs mobiles bloquent les scripts de favoris (bookmarklets), cela peut donc ne pas fonctionner pour tout le monde. Testé sur `Android` avec `Brave`. Si cela ne marche pas chez vous, ouvrez une issue — quelqu'un aura peut-être une solution.

> [!CAUTION]
> Ceci télécharge du code distant (`https://aisatan.github.io/PoE2Dire/PoE2Dire-bookmarklet.js`) et l'**exécute** dans votre navigateur.
> Ce n'est pas obligatoire, mais je **recommande fortement** d'utiliser le **mode navigation privée** par sécurité.

Vidéo de l'installation sur mon téléphone (navigateur Brave) :

https://github.com/user-attachments/assets/a034d803-7d16-443c-8e9b-e5f683d9e309

meilleure qualité : https://youtube.com/shorts/AmYBZYfP4YY

Le bookmarklet pour téléphone charge le build en un seul fichier publié sur GitHub Pages :

```js
javascript:(function(){var s=document.createElement('script');s.src='https://aisatan.github.io/PoE2Dire/PoE2Dire-bookmarklet.js?poe2dire=' + Date.now();s.referrerPolicy='no-referrer';s.onerror=function(){alert('PoE2Dire failed to load. The page may block bookmarklet scripts.');};document.documentElement.appendChild(s);})();
```

Comment l'utiliser :

1. Créez un favori dans le navigateur (n'importe quel site fera l'affaire)
2. Modifiez l'URL et le nom du favori.
3. Collez tout le code `javascript:` ci-dessus comme URL du favori.
4. Donnez-lui un nom facile d'accès, par exemple `0000 poe2dire`
5. Ouvrez une page de notes de mise à jour du forum Path of Exile.
6. Lancez le favori (dans la plupart des navigateurs, il suffit de taper son nom pour le trouver et l'activer)


## Ça ne marche pas chez vous ?

N'hésitez pas à ouvrir une issue sur GitHub, je ferai de mon mieux pour corriger le problème, mais sans promesse.


## Contribuer

N'hésitez pas à poser une question, ouvrir une PR, une issue, ou à forker le projet si vous le souhaitez.
La documentation manque, mais le code JS, même brouillon, devrait rester assez clair à suivre.
Gardez toutefois à l'esprit que mes décennies de JS bricolé peuvent sembler étranges : je ne m'en suis jamais servi pour un vrai projet, seulement pour des scripts avec jQuery.


## Soutenir 🌠

Merci d'envisager l'une de ces petites façons de soutenir le projet :

⭐ Laissez une étoile sur GitHub ⭐

☕ [Offrez-moi un café <3](https://buymeacoffee.com/aisatan) ☕

<img width="32" height="32" alt="blender_emoji_transparent_32" src="https://github.com/user-attachments/assets/02ac03f9-3dd0-4674-8ea2-03b38e0e1f81" />[Faire un don à la Blender Foundation](https://fund.blender.org/donate-once/)
<img width="32" height="32" alt="blender_emoji_transparent_32" src="https://github.com/user-attachments/assets/1e6fa180-211d-4658-9b4f-c549a336a75e" />
