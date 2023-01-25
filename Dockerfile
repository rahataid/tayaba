FROM node:18.12.1-alpine3.17
#install bash
RUN apk add --update bash
#set working directory
WORKDIR /usr/src/app
COPY . .
#get and set env from args
ARG NODE_ENV
ENV env=$NODE_ENV
#make script executable
RUN chmod +x start-server.sh
#install packages
RUN yarn
#expose application working port
ENTRYPOINT ["./start-server.sh"]