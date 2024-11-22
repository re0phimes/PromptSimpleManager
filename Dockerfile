FROM node:latest

ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

RUN npm config set registry https://registry.npmjs.org/ && \
    npm install -g nrm --verbose && \
    nrm use taobao


RUN npm install --verbose

COPY . .

EXPOSE 5173

CMD ["tail", "-f", "/dev/null"]