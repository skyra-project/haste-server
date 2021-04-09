## Information

You may download the `Lavalink.jar` file from either [releases](https://github.com/Frederikam/Lavalink/releases) or from
the [CI server](https://ci.fredboat.com/project.html?projectId=Lavalink).

## Setting your own configuration

1. Duplicate the `application.yml` and rename it to `application.local.yml`
2. Fill the `application.local.yml` with your desired values
3. Build the docker image locally with `.\control.ps1 build`, it will now use the `application.local.yml` rather than the `application.yml`