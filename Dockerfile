FROM node:gallium

WORKDIR /app

COPY package.json /app

RUN npm install -f

COPY . .

RUN npm run build

CMD ["npm", "start"]