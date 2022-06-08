FROM node:lts-alpine
WORKDIR /app
COPY ./dist/apps/backend/ .
COPY .env .
EXPOSE 3333
RUN npm install --production
CMD node main.js