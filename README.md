## 1. 项目介绍

本项目是基于[NSFWJS](https://github.com/infinitered/nsfwjs)的图片鉴黄，使用了[NSFWJS]()提供的预训练模型。

> *本文由GitHub Copilot 生成*

## 2. 项目部署

### 2.1. docker部署
    
1. 下载docker镜像

```bash
docker pull gindex/nsfwjs-api:latest
```

2. 运行容器

```bash
docker run -itd \
           --name nsfwjs \
            -p 3035:3035 \
           --restart=always \
           gindex/nsfwjs-api:latest
```

3. 访问地址

```bash
http://ip:3035/
```


### 2.2. 本地部署

1. 下载项目

```bash
git clone https://github.com/x-dr/nsfw-api.git
```

2. 安装依赖

```bash
npm install
```

3. 运行项目

```bash
npm run start
```

4. 访问地址

```bash
http://ip:3035/
```

### 2.3. vercel部署

> The Serverless Function "index.js" is 111.7mb which exceeds the maximum size limit of 50mb.




### 2.4. heroku部署

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)


## 3. 响应

```json
{
  "Neutral": 0.9852375388145447,  
  "Drawing": 0.007717587053775787,
  "Porn": 0.0043180412612855434,
  "Hentai": 0.002539177890866995,
  "Sexy": 0.00018772167095448822,
  "url": "url",
  "status": 200,
  "rating": 1
}
```

- rating: 1 无害 ; 2 性感 ; 3色情 
- status: 200 成功 ; 400 500 失败
- url: 图片地址
- Drawing: 无害的艺术，或艺术图片
- Hentai: 色情动漫或卡通
- Neutral：一般、中性的内容
- Porn : 不雅内容和行为，通常涉及生殖器
- Sexy : 不雅的挑衅内容，可能包括乳头





