FROM node:lts-alpine3.18
ENV NODE_ENV=production
WORKDIR /dist
LABEL version="v1" description="AIgnition"
# project="https://github.com/yuri2peter/AIgnition" maintainer="yuri2peter@github"
COPY ./dist /dist
ENV SERVER_PORT=3000
CMD ["node", "./server/main.js"]
