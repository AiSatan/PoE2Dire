> [!NOTE]
> PoE2Dire is an unofficial fan-made project and is not affiliated with, associated with, endorsed by, or sponsored by Grinding Gear Games or Path of Exile.

# PoE2Dire

Extension for rendering Path of Exile patch notes in a Dota2-style layout (English only at this moment). 
[For this reddit thread](https://www.reddit.com/r/PathOfExile2/comments/1tkazjr/can_someone_explain_to_me_why_ggg_doesnt_present/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button). 

It's not perfect, but neither am I.

<img width="1280" height="800" alt="01-overview" src="https://github.com/user-attachments/assets/4efc326c-270c-4a18-b46b-d3ca8be557a6" />
<img width="1201" height="1021" alt="showcase" src="https://github.com/user-attachments/assets/c41b4e58-084c-4a46-969e-76e239129df7" />


The extension only injects on:

```text
https://www.pathofexile.com/forum/*
```

It still declares access to `poewiki.net` and `poe2wiki.net` for icon lookup.


## How to use?

0. Install for your browser [Chrome](https://chromewebstore.google.com/detail/paekoknkbpfidmpabiikofkemegpfgnh?utm_source=item-share-cb)/[Firefox](https://addons.mozilla.org/en-US/firefox/addon/poe2dire/)
1. Go to any Path of Exile patch notes forum page ([this one is hot rn](https://www.pathofexile.com/forum/view-thread/3932540))
2. Click the PoE2Dire icon on top to activate it <img width="114" height="79" alt="image" src="https://github.com/user-attachments/assets/2b800f16-d7a4-4f35-b4cc-65940e61ee31" /> (if you don't see it, you need to pin it, use the mosaic icon, find it, click it there)
3. Done
4. You can click it again to deactivate, or simply reload.


## Dota2 Style Search Feature

> [!NOTE]
> This works only if you installed via Chrome/Firefox extension

The second feature of this extension is the ability to search by just starting to type. 
- Yes, just start typing, for example, type `traps`, until you realize `There is no Carol in H.R`. 
- You can press `Enter` to move to the next result. 
- It clears automatically after 2 seconds, so you can easily start searching for a new thing next, so try to search for `daggers` next.


## Install options


> please, consider leaving a review, so more people find it!


### Install on Chrome

[Chrome WebStore](https://chromewebstore.google.com/detail/paekoknkbpfidmpabiikofkemegpfgnh?utm_source=item-share-cb)

### Install on Firefox

[Firefox Browser Add-ons Page](https://addons.mozilla.org/en-US/firefox/addon/poe2dire/) (NOT live yet, Awaiting Review!)


### Do you guys have phones?

This is for phones or browsers where you cannot/don't want to install the extension. 

> [!NOTE]
> Some mobile browsers can block bookmarklet scripts, so this may not work for everyone, tested on `Android` with `Brave`. If it's not working for you, feel free to open an issue, maybe someone has a solution for your case.

> [!CAUTION]
> This will download the remote code (`https://aisatan.github.io/PoE2Dire/PoE2Dire-bookmarklet.js`) and **execute** it with your browser.
> It's not required - but I **strongly suggest** to stay safe and use the **incognito mode**.

Video installation on my phone (Brave browser): 

https://github.com/user-attachments/assets/a034d803-7d16-443c-8e9b-e5f683d9e309

better quality: https://youtube.com/shorts/AmYBZYfP4YY

The phone bookmarklet loads the published single-file build from GitHub Pages:

```js
javascript:(function(){var s=document.createElement('script');s.src='https://aisatan.github.io/PoE2Dire/PoE2Dire-bookmarklet.js?poe2dire=' + Date.now();s.referrerPolicy='no-referrer';s.onerror=function(){alert('PoE2Dire failed to load. The page may block bookmarklet scripts.');};document.documentElement.appendChild(s);})();
```

How to use it:

1. Create a browser bookmark (any site will do)
2. Edit the bookmark URL and Name.
3. Paste the full `javascript:` code above as the bookmark URL.
4. Put some easy accessible name, like `0000 poe2dire`
5. Open a Path of Exile forum patch-notes page.
6. Run the bookmark (in most browsers you can write the name of the bookmark to see and activate it)


## Not working for you?

Feel free to open an issue on github, I will do my best to fix it for you, but no promises.


## Contribution

Please, feel free to ask a question, open PR, issue, or fork it if you want. 
It lacks documentation, but messy js code must be clear enough to follow. 
But, keep in mind, my decades of writing hacky js code might feel strange, cause I never actually used it to make a proper project, only scripts with jQuery.


## Support 🌠

Please, consider any of these little support options:

⭐ Leave a GitHub Star ⭐

☕ [Buy me a coffee <3](https://buymeacoffee.com/aisatan) ☕

<img width="32" height="32" alt="blender_emoji_transparent_32" src="https://github.com/user-attachments/assets/02ac03f9-3dd0-4674-8ea2-03b38e0e1f81" />[Donate to Blender Foundation](https://fund.blender.org/donate-once/)
<img width="32" height="32" alt="blender_emoji_transparent_32" src="https://github.com/user-attachments/assets/1e6fa180-211d-4658-9b4f-c549a336a75e" />

