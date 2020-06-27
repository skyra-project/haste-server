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
            build { docker build -t docker.pkg.github.com/skyra-project/docker-images/lavalink:latest . }
            run { docker container run -it docker.pkg.github.com/skyra-project/docker-images/lavalink:latest }
            deploy { docker push docker.pkg.github.com/skyra-project/docker-images/lavalink:latest }
            remove { docker rmi -f docker.pkg.github.com/skyra-project/docker-images/lavalink }
            default { Write-Host "Unrecognized command, please try again" -ForegroundColor Red }
        }
    }
}

Step-Main @args