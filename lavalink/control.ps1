Function Step-Main {
    Param (
        [string]$Command = "default"
    )

    Process {
        switch ( $Command ) {
            login {
                $Username = $( Read-Host "Please provide your GitHub username" )
                $SecurePassword = $( Read-Host -AsSecureString "Please provide a GitHub token with access to publish packages" )
                ConvertFrom-SecureString -SecureString $SecurePassword | docker login https://docker.pkg.github.com -u $Username --password-stdin
            }
            build { docker build -t skyrabot/lavalink:master . }
            run { docker container run -it skyrabot/lavalink:master /bin/sh }
            deploy { docker push skyrabot/lavalink:master }
            remove { docker rmi -f skyrabot/lavalink }
            default { Write-Host "Unrecognized command, please try again" -ForegroundColor Red }
        }
    }
}

Step-Main @args