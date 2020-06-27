Function Step-Main {
    Param (
        [string]$Command = "default"
    )

    Process {
        switch ( $Command ) {
            login { docker login }
            build { docker build -t skyrabot/lavalink:latest . }
            run { docker container run -it skyrabot/lavalink:latest }
            deploy { docker push skyrabot/lavalink:latest }
            remove { docker rmi -f skyrabot/lavalink }
            default { Write-Host "Unrecognized command, please try again" -ForegroundColor Red }
        }
    }
}

Step-Main @args