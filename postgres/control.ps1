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
            build {
                if ( Test-Path ".\local.Dockerfile" -PathType Leaf ) {
                    # Backup the original Dockerfile to
                    Copy-Item ".\Dockerfile" ".\Dockerfile.backup"

                    # Rename the local Dockerfile
                    Copy-Item ".\local.Dockerfile" ".\Dockerfile"

                    # Trigger a Docker build
                    docker build -t docker.pkg.github.com/skyra-project/docker-images/postgres:master .

                    # Move the backup back to the original Dockerfile
                    Move-Item -Force ".\Dockerfile.backup" ".\Dockerfile"
                }
                else {
                    docker build -t docker.pkg.github.com/skyra-project/docker-images/postgres:master .
                }
            }
            run { docker container run -it docker.pkg.github.com/skyra-project/docker-images/postgres:master /bin/sh }
            deploy { docker push docker.pkg.github.com/skyra-project/docker-images/postgres:master }
            remove { docker rmi -f docker.pkg.github.com/skyra-project/docker-images/postgres }
            default { Write-Host "Unrecognized command, please try again" -ForegroundColor Red }
        }
    }
}

Step-Main @args