FROM node:18.12.1-alpine3.17
WORKDIR /usr/src/app
COPY . .
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "stage" ] ; then yarn run stage; else yarn run production ; fi