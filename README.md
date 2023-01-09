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
|   PayPal    |  ![PayPalImage][]  |                                               [Click Here](https://donate.skyra.pw/paypal)                                                |
|   BitCoin   | ![BitcoinImage][]  |         [3JNzCHMTFtxYFWBnVtDM9Tt34zFbKvdwco](bitcoin:3JNzCHMTFtxYFWBnVtDM9Tt34zFbKvdwco?amount=0.01&label=Skyra%20Discord%20Bot)          |
|  Ethereum   | ![EthereumImage][] | [0xcB5EDB76Bc9E389514F905D9680589004C00190c](ethereum:0xcB5EDB76Bc9E389514F905D9680589004C00190c?amount=0.01&label=Skyra%20Discord%20Bot) |
|  Litecoin   | ![LitecoinImage][] |         [MNVT1keYGMfGp7vWmcYjCS8ntU8LNvjnqM](litecoin:MNVT1keYGMfGp7vWmcYjCS8ntU8LNvjnqM?amount=0.01&label=Skyra%20Discord%20Bot)         |

## Contributors

Please make sure to read the [Contributing Guide][contributing] before making a pull request.

Thank you to all the people who already contributed to Sapphire!

<a href="https://github.com/skyra-project/docker-image/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=skyra-project/docker-image" />
</a>

[contributing]: https://github.com/skyra-project/.github/blob/main/.github/CONTRIBUTING.md
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
