FROM --platform=linux/amd64 adoptopenjdk/openjdk13-openj9:alpine-jre

RUN apk add --no-cache dumb-init

WORKDIR /opt/Lavalink

COPY Lavalink.jar Lavalink.jar
COPY application* ./

RUN if [[ -f "./application.local.yml" ]]; then mv "./application.local.yml" "./application.yml"; fi

EXPOSE 2333

CMD [ "dumb-init", "java", "-jar", "Lavalink.jar"]
