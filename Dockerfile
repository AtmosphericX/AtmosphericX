FROM node:20

RUN apt-get update && apt-get install -y \
    git \
    bash \
    curl \
    python3 \
    python3-pip \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ARG REPO=https://github.com/AtmosphericX/AtmosphericX.git
ARG BRANCH=main
RUN git clone --depth 1 --branch ${BRANCH} ${REPO} .

RUN chmod +x build-tools/docker/*.sh || true

RUN if [ -f build-tools/docker/docker-install.sh ]; then \
    bash build-tools/docker/docker-install.sh || true ; \
    fi

EXPOSE 80
CMD ["bash", "build-tools/docker/docker-start.sh"]