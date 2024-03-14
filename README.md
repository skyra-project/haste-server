<div align="center">

![Skyra Logo](https://cdn.skyra.pw/gh-assets/skyra_avatar.png)

# Skyra Project Haste Server

**The HasteServer image used to provide a reliable, self-controlled and
self-hosted HasteServer for Skyra**

[![Discord](https://discord.com/api/guilds/254360814063058944/embed.png?style=banner2)](https://join.skyra.pw)

</div>

## What is this repo?

This repo holds the source code used to provide a reliable, self-controlled and
self-hosted HasteServer for Skyra. We saw the need to make our own version
because the official image is heavily outdated. It is using outdated bundling,
outdated packages, does not use TypeScript and its general code quality is not
up to Skyra Project standards. That said, this image would not exist without the
awesome work that [John Crepezzi](https://github.com/seejohnrun) has put in the
official [haste-server](https://github.com/seejohnrun/haste-server) and we thank
him greatly for that.

## API Documentation

We have published a Swagger UI for the API, you can access it by visiting
[`/swagger-ui`](https://hastebin.skyra.pw/swagger-ui) on the server. If you are
running this locally, you can access it by visiting
`http://localhost:8290/swagger-ui`.

## Paste lifetime

Pastes will stay for 3 days from creation. They may be removed earlier and
without notice.

## Usage

### From the [website]

Type or paste what you want to upload into the website, save it, and then copy
the URL. Send that to someone and they'll be able to view the file.

To make a new entry, click "New", or press `CTRL+N` (Windows/Linux) or `⌘+N`
(MacOS) on the keyboard.

### From the Console

#### UNIX Shell

You can use the following function to easily POST to a Hasteserver instance. It
should be noted that due to POSIX restrictions and shell differences, the
following may not work, but is guaranteed to on BaSH, Zsh, Fish, etc.

##### Prerequisites

For this to run, your system needs:

- `cat`
- [`curl`](https://github.com/curl/curl)
- [`jq`](https://github.com/stedolan/jq)

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

After running that, the output of `cat something` will show up as a URL which
has been conveniently copied to your clipboard.

#### PowerShell (Windows/Linux/MacOS)

##### Prerequisites

You have to install
[`powershell`](https://github.com/PowerShell/powershell/releases/latest) for
this script to work

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

## Contributors

Please make sure to read the [Contributing Guide][contributing] before making a
pull request.

Thank you to all the people who already contributed to Skyra Project!

<a href="https://github.com/skyra-project/haste-server/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=skyra-project/haste-server" />
</a>

[contributing]:
  https://github.com/skyra-project/.github/blob/main/.github/CONTRIBUTING.md
[website]: https://hastebin.skyra.pw
