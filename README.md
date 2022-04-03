<div align="center">

![Sapphire Logo](https://cdn.skyra.pw/gh-assets/skyra_avatar.png)

# Skyra Project Docker Images

**Source code various docker images published to DockerHub and GitHub Container Registry.**

[![Discord](https://discord.com/api/guilds/254360814063058944/embed.png?style=banner2)](https://join.skyra.pw)

</div>

## What is this repo?

This repo holds all the Docker images used by Skyra, neatly organized in folders. Each of these images is published to Dockerhub under the organization [skyrabot] and Github Package Registry, which is found in the packages section in the repository details to the side.

Each of the image folders in this repository has a `control.ps1` file that can be used in Powershell to execute common Docker commands such as building and publishing that specific image.

## Included images

### Postgres [![Docker Pulls](https://img.shields.io/docker/pulls/skyrabot/postgres?label=postgres%20docker%20pulls&logo=docker)](https://hub.docker.com/r/skyrabot/postgres)

The Postgres image is used to provide the Database for Skyra. We maintain this image in order to set defaults for the user, password and database name that is used for Skyra.

### Haste-Server [![Docker Pulls](https://img.shields.io/docker/pulls/skyrabot/haste-server?label=haste-server%20docker%20pulls&logo=docker)](https://hub.docker.com/r/skyrabot/haste-server)

The haste-server image is used to provide a reliable, self-controlled and self-hosted HasteServer for Skyra. We saw the need to make our own version because the official image is heavily outdated. It is using outdated bundling, outdated packages, does not use TypeScript and its general code quality is not up to Skyra Project standards. That said, this image would not exist without the awesome work that [John Crepezzi](https://github.com/seejohnrun) has put in the official [haste-server](https://github.com/seejohnrun/haste-server) and we thank him greatly for that.

## Buy us some doughnuts

Skyra Project is open source and always will be, even if we don't get donations. That said, we know there are amazing people who
may still want to donate just to show their appreciation. Thanks you very much in advance!

We accept donations through Patreon, BitCoin, Ethereum, and Litecoin. You can use the buttons below to donate through your method of choice.

| Donate With |         QR         |                                                                  Address                                                                  |
| :---------: | :----------------: | :---------------------------------------------------------------------------------------------------------------------------------------: |
|   Patreon   | ![PatreonImage][]  |                                               [Click Here](https://donate.skyra.pw/patreon)                                               |
|   PayPal    |  ![PayPalImage][]  |                     [Click Here](https://donate.skyra.pw/paypal)                      |
|   BitCoin   | ![BitcoinImage][]  |         [3JNzCHMTFtxYFWBnVtDM9Tt34zFbKvdwco](bitcoin:3JNzCHMTFtxYFWBnVtDM9Tt34zFbKvdwco?amount=0.01&label=Skyra%20Discord%20Bot)          |
|  Ethereum   | ![EthereumImage][] | [0xcB5EDB76Bc9E389514F905D9680589004C00190c](ethereum:0xcB5EDB76Bc9E389514F905D9680589004C00190c?amount=0.01&label=Skyra%20Discord%20Bot) |
|  Litecoin   | ![LitecoinImage][] |         [MNVT1keYGMfGp7vWmcYjCS8ntU8LNvjnqM](litecoin:MNVT1keYGMfGp7vWmcYjCS8ntU8LNvjnqM?amount=0.01&label=Skyra%20Discord%20Bot)         |

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://favware.tech/"><img src="https://avatars3.githubusercontent.com/u/4019718?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jeroen Claassens</b></sub></a><br /><a href="https://github.com/skyra-project/docker-images/commits?author=Favna" title="Code">💻</a> <a href="https://github.com/skyra-project/docker-images/commits?author=Favna" title="Documentation">📖</a> <a href="#projectManagement-Favna" title="Project Management">📆</a></td>
    <td align="center"><a href="https://github.com/kyranet"><img src="https://avatars0.githubusercontent.com/u/24852502?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Antonio Román</b></sub></a><br /><a href="#projectManagement-kyranet" title="Project Management">📆</a></td>
    <td align="center"><a href="https://github.com/Nytelife26"><img src="https://avatars.githubusercontent.com/u/22531310?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Tyler J Russell</b></sub></a><br /><a href="https://github.com/skyra-project/docker-images/commits?author=Nytelife26" title="Code">💻</a></td>
    <td align="center"><a href="https://skyra.pw/"><img src="https://avatars.githubusercontent.com/u/61647701?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Skyra</b></sub></a><br /><a href="#maintenance-NM-EEA-Y" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/apps/depfu"><img src="https://avatars.githubusercontent.com/in/715?v=4?s=100" width="100px;" alt=""/><br /><sub><b>depfu[bot]</b></sub></a><br /><a href="#maintenance-depfu[bot]" title="Maintenance">🚧</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

<!----------------- LINKS --------------->

[skyrabot]: https://hub.docker.com/u/skyrabot
[wizard]: https://github.com/skyra-project/wizard
[skyra invite link]: https://invite.skyra.pw
[support server]: https://join.skyra.pw
[patreon]: https://donate.skyra.pw/patreon
[patreonimage]: https://cdn.skyra.pw/gh-assets/patreon.png
[paypalimage]: https://cdn.skyra.pw/gh-assets/paypal.png
[bitcoinimage]: https://cdn.skyra.pw/gh-assets/bitcoin.png
[ethereumimage]: https://cdn.skyra.pw/gh-assets/ethereum.png
[litecoinimage]: https://cdn.skyra.pw/gh-assets/litecoin.png
