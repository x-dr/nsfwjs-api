FROM node:lts-slim

RUN apt-get update && apt-get install -y python3 build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

# 检测架构并重建 @tensorflow/tfjs-node
# RUN uname -m

# RUN if [ "$(uname -m)" = "aarch64" ]; then npm rebuild @tensorflow/tfjs-node --build-from-source; fi

COPY . .

EXPOSE 3035

CMD [ "npm", "start" ]