## Information

Haste is an open-source pastebin software written in node.js, which is easily
installable in any network. It can be backed by either redis or filesystem,
and has a very easy adapter interface for other stores. A publicly available
version can be found at [hastebin.com](http://hastebin.com)

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
