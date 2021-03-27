<div align="center">

# Hasteserver

**open-source pastebin for all**

[![License](https://img.shields.io/github/license/skyra-project/docker-images?logo=github&maxAge=3600&style=flat-square)](https://github.com/skyra-project/docker-images/blob/main/LICENSE.md)
[![Depfu](https://badges.depfu.com/badges/1fa296942ce74ea50e813495d4fc3343/count.svg)](https://depfu.com/github/skyra-project/docker-images?project_id=23823)
[![Patreon](https://img.shields.io/badge/donate-patreon-F96854.svg?logo=patreon)](https://donate.skyra.pw/patreon)

</div>

---

**_Code taken from [seejohnrun/haste-server](https://github.com/seejohnrun/haste-server) and adopted for Skyra environment_**

**_Table of Contents_**

-   [Hasteserver](#hasteserver)
    -   [Description](#description)
    -   [Installation](#installation)
    -   [Usage](#usage)
        -   [From [the website][website]](#from-the-websitewebsite)
        -   [From the Console](#from-the-console)
            -   [Shell (Bash/Zsh/Fish/etc)](#shell-bashzshfishetc)
                -   [Prerequisite](#prerequisite)
                -   [Script](#script)
                -   [Usage](#usage-1)
            -   [PowerShell (Windows/Linux/MacOS)](#powershell-windowslinuxmacos)
                -   [Prerequisite](#prerequisite-1)
                -   [Script](#script-1)
                -   [Usage](#usage-2)
    -   [Paste lifetime](#paste-lifetime)

## Description

Haste is an open-source pastebin software written in NodeJS, which is easily installable in any network. It can be backed by either redis or filesystem, and has a very easy adapter interface for other stores. A publicly available version can be found at [hastebin.skyra.pw][website]

## Installation

You can use the following Docker Compose config to set up this image:

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
        image: skyrabot/haste-server
        restart: always
        depends_on:
            - redis
        ports:
            - '8290:8290'
        environment:
            PORT: 8290
            STORAGE_TYPE: redis
            STORAGE_HOST: host.docker.internal
            STORAGE_PORT: 8287
            STORAGE_PASSWORD: redis
            STORAGE_DB: 2
            STORAGE_EXPIRE_SECONDS: 21600
```

## Usage

### From the [website]

Type what you want me to see, click "Save", and then copy the URL. Send that
URL to someone and they'll see what you see.

To make a new entry, click "New" (or type 'control + n')

### From the Console

#### Shell (Bash/Zsh/Fish/etc)

Use the following function to easily POST to the hastebin server

##### Prerequisite

You have to install [`jq`](https://stedolan.github.io/jq/) for this script to work

##### Script

```sh
function haste() {
    a=$(cat);
    curl -X POST -s -d "$a" https://hastebin.skyra.pw/documents |  jq --raw-output '.key' | { read key; echo "https://hastebin.skyra.pw/${key}"; }
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
cat something | haste | xsel
```

After running that, the STDOUT output of `cat something` will show up as a URL
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
