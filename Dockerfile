FROM node:lts-slim

RUN apt-get update && apt-get install -y python3 build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3035

CMD [ "npm", "start" ]