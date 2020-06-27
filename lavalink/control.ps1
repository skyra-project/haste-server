Function Step-Main {
    Param (
        [string]$Command = "default"
    )

    Process {
        switch ( $Command ) {
            login { docker login }
            build { docker build -t docker.pkg.github.com/skyra-project/docker-images/lavalink:latest . }
            run { docker container run -it docker.pkg.github.com/skyra-project/docker-images/lavalink:latest }
            deploy { docker push docker.pkg.github.com/skyra-project/docker-images/lavalink:latest }
            remove { docker rmi -f docker.pkg.github.com/skyra-project/docker-images/lavalink }
            default { Write-Host "Unrecognized command, please try again" -ForegroundColor Red }
        }
    }
}

Step-Main @args