FROM node:18.18.2-alpine

RUN apk update && apk upgrade
RUN apk add git

ENV APP_DIR=/app
RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}

COPY ./package.json .
COPY ./package-lock.json .
RUN npm install

COPY . /app

ARG BUILD_ENV=DEV
ENV BUILD_ENV=${BUILD_ENV}

RUN echo "SET ENV: ${BUILD_ENV}"

RUN if [ "${BUILD_ENV}" = "PROD" ] ; then npm run build  ; else npm run dev_build ; fi

RUN chmod 500 entrypoint.sh

CMD ["sh", "-c", "/app/entrypoint.sh"]
