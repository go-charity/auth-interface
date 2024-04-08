FROM node:gallium-alpine

WORKDIR /app

COPY package.json /app

RUN npm install -f

COPY . .

ENV NEXT_PUBLIC_AUTH_BACKEND_HOST=http://172.17.160.247:32007
ENV NEXT_PUBLIC_API_DOMAIN=localhost

RUN npm run build

EXPOSE 3000

CMD ["npx", "next", "start", "-p", "3000"]