FROM node:18.12.1-alpine3.17
#set working directory
WORKDIR /usr/src/app
COPY . .
#make script executable
# RUN chmod +x wait-for-it.sh
RUN chmod +x start-server.sh
#install packages
RUN yarn
#expose application working port
ENTRYPOINT ["./start-server.sh"]







# WORKDIR /usr/src/app
# COPY . .
# RUN yarn
# ARG NODE_ENV
# #CMD [ "yarn", "production" ]
# CMD if [ "$NODE_ENV" = "stage" ] ; then ["yarn", "stage"]; else ["yarn", "production"] ; fi