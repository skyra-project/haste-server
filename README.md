# Skyra [![Discord](https://discordapp.com/api/guilds/254360814063058944/embed.png)](https://join.skyra.pw)

[![Status](https://top.gg/api/widget/status/266624760782258186.svg?noavatar=true)](https://top.gg/bot/266624760782258186)
[![Servers](https://top.gg/api/widget/servers/266624760782258186.svg?noavatar=true)](https://top.gg/bot/266624760782258186)
[![Upvotes](https://top.gg/api/widget/upvotes/266624760782258186.svg?noavatar=true)](https://top.gg/bot/266624760782258186)

## What is this repo?

This repo holds all the Docker images used by Skyra, neatly organized in folders. Each of these images is published to Dockerhub under the organization [skyrabot] and Github Package Registry, which is found in the packages section in the repository details to the side.

Each of the image folders in this repository has a `control.ps1` file that can be used in Powershell to execute common Docker commands such as building and publishing that specific image.

## Included images

### Lavalink

The Lavalink image is used for music in Skyra. We maintain our own image in order to be able to run it on Alpine Linux with OpenJ9 JRE as well as have full control over the application.yml and jar file.

### Postgres

The Postgres image is used to provide the Database for Skyra. We maintain this image in order to set defaults for the user, password and database name that is used for Skyra.

### Wizard

Information on the Wizard API and its Docker image can be found on the [Wizard] repository

## Links

**Skyra links**

-   [Skyra Invite Link]
-   [Support Server]
-   [Patreon]

## Buy us some doughnuts

Skyra Project is open source and always will be, even if we don't get donations. That said, we know there are amazing people who
may still want to donate just to show their appreciation. Thanks you very much in advance!

We accept donations through Patreon, BitCoin, Ethereum, and Litecoin. You can use the buttoms below to donate through your method of choice.

| Donate With |         QR         |                                                                  Address                                                                  |
| :---------: | :----------------: | :---------------------------------------------------------------------------------------------------------------------------------------: |
|   Patreon   | ![PatreonImage][]  |                                               [Click Here](https://www.patreon.com/kyranet)                                               |
|   PayPal    |  ![PayPalImage][]  |                     [Click Here](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=CET28NRZTDQ8L)                      |
|   BitCoin   | ![BitcoinImage][]  |         [3JNzCHMTFtxYFWBnVtDM9Tt34zFbKvdwco](bitcoin:3JNzCHMTFtxYFWBnVtDM9Tt34zFbKvdwco?amount=0.01&label=Skyra%20Discord%20Bot)          |
|  Ethereum   | ![EthereumImage][] | [0xcB5EDB76Bc9E389514F905D9680589004C00190c](ethereum:0xcB5EDB76Bc9E389514F905D9680589004C00190c?amount=0.01&label=Skyra%20Discord%20Bot) |
|  Litecoin   | ![LitecoinImage][] |         [MNVT1keYGMfGp7vWmcYjCS8ntU8LNvjnqM](litecoin:MNVT1keYGMfGp7vWmcYjCS8ntU8LNvjnqM?amount=0.01&label=Skyra%20Discord%20Bot)         |

<!----------------- LINKS --------------->

[skyrabot]: https://hub.docker.com/u/skyrabot
[wizard]: https://github.com/skyra-project/wizard

[skyra invite link]: https://skyra.pw/invite
[support server]: https://join.skyra.pw

[patreon]: https://www.patreon.com/kyranet
[patreonimage]: https://raw.githubusercontent.com/skyra-project/Skyra/master/assets/github/patreon.png
[paypalimage]: https://raw.githubusercontent.com/skyra-project/Skyra/master/assets/github/paypal.png
[bitcoinimage]: https://raw.githubusercontent.com/skyra-project/Skyra/master/assets/github/bitcoin.png
[ethereumimage]: https://raw.githubusercontent.com/skyra-project/Skyra/master/assets/github/ethereum.png
[litecoinimage]: https://raw.githubusercontent.com/skyra-project/Skyra/master/assets/github/litecoin.png
