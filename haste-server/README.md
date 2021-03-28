<div align="center">

# HasteServer

**open-source pastebin for all**

[![License](https://img.shields.io/github/license/skyra-project/docker-images?logo=github&maxAge=3600&style=flat-square)](https://github.com/skyra-project/docker-images/blob/main/LICENSE.md)
[![Depfu](https://badges.depfu.com/badges/1fa296942ce74ea50e813495d4fc3343/count.svg)](https://depfu.com/github/skyra-project/docker-images?project_id=23823)
[![Patreon](https://img.shields.io/badge/donate-patreon-F96854.svg?logo=patreon)](https://donate.skyra.pw/patreon)

</div>

---

**_Code taken from [seejohnrun/haste-server](https://github.com/seejohnrun/haste-server) and adopted for Skyra environment_**

**_Table of Contents_**

-   [HasteServer](#hasteserver)
    -   [Description](#description)
    -   [Installation](#installation)
    -   [Usage](#usage)
        -   [From the website](#from-the-website)
        -   [From the Console](#from-the-console)
            -   [UNIX Shell](#unix-shell)
                -   [Prerequisites](#prerequisites)
                -   [Script](#script)
                -   [Usage](#usage-1)
            -   [PowerShell (Windows/Linux/MacOS)](#powershell-windowslinuxmacos)
                -   [Prerequisite](#prerequisite)
                -   [Script](#script-1)
                -   [Usage](#usage-2)
    -   [Paste lifetime](#paste-lifetime)

## Description

Haste is an open-source pastebin server written for Node.JS, which is easily
installable on any system. It can use either Redis or the filesystem for its
backend, and it has a very easy-to-use adapter interface for other stores. A
publicly available version can be found at [hastebin.skyra.pw][website].

## Installation

You can use the following Docker Compose configuration to set up this image:

```yaml
version: '2.4'
services:
    redis:
        container_name: redis
        image: redis:alpine
        restart: always
        ports:
            - '8287:8287'
        command: redis-server --port 8287 --requirepass redis
    hasteserver:
        container_name: hasteserver
        image: skyrabot/haste-server:latest
        build: .
        restart: always
        tty: true
        depends_on:
            - redis
        ports:
            - '8290:8290'
        environment:
            PORT: 8290
            STORAGE_TYPE: redis
            STORAGE_HOST: redis
            STORAGE_PORT: 8287
            STORAGE_PASSWORD: redis
            STORAGE_DB: 2
            STORAGE_EXPIRE_SECONDS: 21600
```

## Usage

### From the [website]

Type or paste what you want to upload into the website, save it, and then copy
the URL. Send that to someone and they'll be able to view the file.

To make a new entry, click "New", or press `CTRL+N` (Windows/Linux) or `⌘+N` (MacOS) on the keyboard.

### From the Console

#### UNIX Shell

You can use the following function to easily POST to a Hasteserver instance.
It should be noted that due to POSIX restrictions and shell differences, the
following may not work, but is guaranteed to on BaSH, Zsh, Fish, et cetera.

##### Prerequisites

For this to run, your system needs:

-   `cat`
-   [`curl`](https://github.com/curl/curl)
-   [`jq`](https://github.com/stedolan/jq)

##### Script

```sh
haste() {
	curl -X POST -s -d "$(cat)" https://hastebin.skyra.pw/documents | jq --raw-output '.key' | { read key; echo "https://hastebin.skyra.pw/${key}"; }
}
```

##### Usage

```sh
cat something | haste
# https://hastebin.skyra.pw/1238193
```

You can even take this a step further, and cut out the last step of copying the
URL with:

**MacOS:**

```sh
cat something | haste | pbcopy
```

**Linux:**

```sh
cat something | haste | copy_command
```

You should replace `copy_command` with your clipboard of choice. This is
typically `xsel` or `xclipcopy` on systems using X11.

After running that, the output of `cat something` will show up as a URL
which has been conveniently copied to your clipboard.

#### PowerShell (Windows/Linux/MacOS)

##### Prerequisite

You have to install [`powershell`](https://github.com/PowerShell/powershell/releases/latest) for this script to work

##### Script

```ps1
Function haste {
	$fileContent = Get-Content -Path $args[0] -Encoding UTF8 -Raw
	$response = Invoke-RestMethod -Uri https://hastebin.skyra.pw/documents -Method POST -Body $fileContent
	$key = $response.key

	Write-Host https://hastebin.skyra.pw/$key
}
```

##### Usage

```sh
haste .\path\to\file
# https://hastebin.skyra.pw/1238193
```

## Paste lifetime

Pastes will stay for 6 hours from their last view. They may be removed earlier
and without notice.

[website]: http://hastebin.skyra.pw
