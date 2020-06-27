Function Step-Main {
    Param (
        [string]$Command = "default"
    )

    Process {
        switch ( $Command ) {
            login { docker login }
            build { docker build -t skyrabot/postgres:latest . }
            run { docker container run -it skyrabot/postgres:latest }
            deploy { docker push skyrabot/postgres:latest }
            remove { docker rmi -f skyrabot/postgres }
            default { Write-Host "Unrecognized command, please try again" -ForegroundColor Red }
        }
    }
}

Step-Main @args