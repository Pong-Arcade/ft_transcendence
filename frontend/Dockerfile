FROM node:latest

RUN mkdir -p /frontend

WORKDIR /frontend

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "preview"]
