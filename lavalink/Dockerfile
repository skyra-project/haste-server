FROM adoptopenjdk/openjdk13-openj9:alpine-jre

WORKDIR /opt/Lavalink

COPY Lavalink.jar Lavalink.jar
COPY application* ./

RUN if [[ -f "./application.local.yml" ]]; then mv "./application.local.yml" "./application.yml"; fi

EXPOSE 2333

CMD ["java", "-jar", "Lavalink.jar"]
