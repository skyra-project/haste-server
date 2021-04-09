## Setting your own configuration

1. Duplicate the `Dockerfile` to `local.Dockerfile`
2. Fill the `local.Dockerfile` with your desired values
3. Build the docker image locally with `.\control.ps1 build`, it will now use the `local.Dockerfile` rather than the `Dockerfile`