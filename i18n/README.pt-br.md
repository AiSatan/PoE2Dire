[🇬🇧 English](../README.md) ·
🇧🇷 Português ·
[🇷🇺 Русский](README.ru.md) ·
[🇹🇭 ไทย](README.th.md) ·
[🇩🇪 Deutsch](README.de.md) ·
[🇫🇷 Français](README.fr.md) ·
[🇪🇸 Español](README.es.md) ·
[🇯🇵 日本語](README.ja.md)

> [!IMPORTANT]
> **Esta tradução foi feita por máquina e não foi revisada por um falante nativo.**
> Ela pode conter erros e imprecisões. O original em inglês: [README.md](../README.md).
> Ajuda para melhorá-la é muito bem-vinda — abra um PR ou uma issue!

> [!NOTE]
> PoE2Dire é um projeto não oficial feito por fãs. Não é afiliado, associado, endossado nem patrocinado pela Grinding Gear Games ou por Path of Exile.

# PoE2Dire

Extensão que exibe as notas de atualização de Path of Exile (1 e 2) em um layout no estilo Dota 2.
[Baseada nesta thread do Reddit](https://www.reddit.com/r/PathOfExile2/comments/1tkazjr/can_someone_explain_to_me_why_ggg_doesnt_present/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button).

[Thread do Reddit](https://www.reddit.com/r/PathOfExile2/comments/1toxfei/dota2_style_patch_notes_browser_extension/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button) sobre a extensão no subreddit de Path of Exile 2.

<img width="1539" height="1157" alt="preview_update" src="https://github.com/user-attachments/assets/e5e48c44-386b-4df3-8ae6-9d21aa8b9f43" />
<img width="1201" height="1021" alt="showcase" src="https://github.com/user-attachments/assets/c41b4e58-084c-4a46-969e-76e239129df7" />


A extensão só é executada em:

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

Ela também solicita acesso a `poewiki.net` e `poe2wiki.net` para buscar descrições e imagens.

Adicionalmente, `cdn.poedb.tw` e `cdn.poe2db.tw` são usados para busca rápida de ícones.


## Como usar?

0. Instale para o seu navegador: [Chrome](https://chromewebstore.google.com/detail/paekoknkbpfidmpabiikofkemegpfgnh?utm_source=item-share-cb)/[Firefox](https://addons.mozilla.org/en-US/firefox/addon/poe2dire/)
1. Abra qualquer página de notas de atualização no fórum de Path of Exile ([esta está em alta agora](https://www.pathofexile.com/forum/view-thread/3932540))
2. Clique no ícone do PoE2Dire no topo para ativá-la <img width="114" height="79" alt="image" src="https://github.com/user-attachments/assets/2b800f16-d7a4-4f35-b4cc-65940e61ee31" /> (se não estiver vendo o ícone, é preciso fixá-lo: clique no ícone de mosaico, procure por ele e clique ali)
3. Pronto
4. Você pode clicar de novo para desativar, ou simplesmente recarregar a página.

Exemplo em vídeo: [https://www.youtube.com/watch?v=ES66rQrVNQY](https://www.youtube.com/watch?v=ES66rQrVNQY)


## Recursos

- Comece a digitar para abrir a busca — é só digitar sua palavra-chave, nada além disso.
- Sumário próprio — bonito e fácil de usar!
- Descrição de itens e habilidades ao passar o mouse — não lembra o que aquele item único faz? Passe o mouse e veja a descrição da wiki!
- Descrição de palavras-chave ao passar o mouse — você é novo e só tem 5000 horas de jogo? Sem problema: passe o mouse sobre palavras desconhecidas como "aggregated" e veja o que significam! (baseado na página de palavras-chave da poewiki — ou seja, só PoE; jogadores de PoE2, não se confundam por enquanto)

## Opções de instalação


> por favor, deixe uma avaliação para que mais pessoas encontrem a extensão!


### Instalar no Chrome

[Chrome WebStore](https://chromewebstore.google.com/detail/paekoknkbpfidmpabiikofkemegpfgnh?utm_source=item-share-cb)

### Instalar no Firefox (funciona também no Firefox mobile)

[Página de complementos do Firefox](https://addons.mozilla.org/en-US/firefox/addon/poe2dire/)

### Instalar como userscript

> [!CAUTION]
> Isto é para quem já sabe o que são userscripts

Espero que você já saiba como instalar um script no seu "monkey". Você pode baixar o `PoE2Dire.user.js` na página de [GitHub Releases](https://github.com/aisatan/PoE2Dire/releases). Aqui está um exemplo em vídeo para o ViolentMonkey: [https://www.youtube.com/watch?v=cgWVGSAxoEY](https://www.youtube.com/watch?v=cgWVGSAxoEY)

> Dizem por aí: "Dá para colocar um link direto para o .js bruto na página de instalação".

Resumindo, funciona assim:

1. Baixe o arquivo `PoE2Dire.user.js` em [GitHub Releases](https://github.com/aisatan/PoE2Dire/releases).
2. Abra o arquivo `PoE2Dire.user.js` da release.
3. Instale-o no seu gerenciador de userscripts.
4. Em uma página de notas de atualização do fórum de Path of Exile, abra o menu do gerenciador de userscripts e clique em `Toggle PoE2Dire`.

Só testei isso no Firefox com Tampermonkey e ViolentMonkey. Se não funcionar para você, fique à vontade para abrir uma issue.


### Vocês têm telefones?

Isto é para telefones ou navegadores onde você não pode ou não quer instalar a extensão.

> [!NOTE]
> Alguns navegadores móveis bloqueiam scripts de favoritos (bookmarklets), então pode não funcionar para todo mundo. Testado no `Android` com o `Brave`. Se não funcionar para você, abra uma issue — talvez alguém tenha uma solução para o seu caso.

> [!CAUTION]
> Isto baixa código remoto (`https://aisatan.github.io/PoE2Dire/PoE2Dire-bookmarklet.js`) e o **executa** no seu navegador.
> Não é obrigatório, mas eu **recomendo fortemente** usar o **modo anônimo** por segurança.

Vídeo da instalação no meu telefone (navegador Brave):

https://github.com/user-attachments/assets/a034d803-7d16-443c-8e9b-e5f683d9e309

melhor qualidade: https://youtube.com/shorts/AmYBZYfP4YY

O bookmarklet para celular carrega a build de arquivo único publicada no GitHub Pages:

```js
javascript:(function(){var s=document.createElement('script');s.src='https://aisatan.github.io/PoE2Dire/PoE2Dire-bookmarklet.js?poe2dire=' + Date.now();s.referrerPolicy='no-referrer';s.onerror=function(){alert('PoE2Dire failed to load. The page may block bookmarklet scripts.');};document.documentElement.appendChild(s);})();
```

Como usar:

1. Crie um favorito no navegador (qualquer site serve)
2. Edite a URL e o nome do favorito.
3. Cole todo o código `javascript:` acima como URL do favorito.
4. Dê um nome de fácil acesso, por exemplo `0000 poe2dire`
5. Abra uma página de notas de atualização do fórum de Path of Exile.
6. Execute o favorito (na maioria dos navegadores basta digitar o nome dele para encontrá-lo e ativá-lo)


## Não funcionou para você?

Fique à vontade para abrir uma issue no GitHub. Vou fazer o meu melhor para resolver, mas sem promessas.


## Contribuindo

Sinta-se à vontade para tirar dúvidas, abrir um PR, uma issue ou fazer um fork, se quiser.
Falta documentação, mas o código JS, mesmo bagunçado, deve ser claro o suficiente para acompanhar.
Mas tenha em mente que minhas décadas escrevendo JS improvisado podem parecer estranhas, porque nunca usei isso para fazer um projeto de verdade, só scripts com jQuery.


## Apoiar 🌠

Considere qualquer uma destas pequenas formas de apoio:

⭐ Deixe uma estrela no GitHub ⭐

☕ [Me pague um café <3](https://buymeacoffee.com/aisatan) ☕

<img width="32" height="32" alt="blender_emoji_transparent_32" src="https://github.com/user-attachments/assets/02ac03f9-3dd0-4674-8ea2-03b38e0e1f81" />[Doar para a Blender Foundation](https://fund.blender.org/donate-once/)
<img width="32" height="32" alt="blender_emoji_transparent_32" src="https://github.com/user-attachments/assets/1e6fa180-211d-4658-9b4f-c549a336a75e" />
