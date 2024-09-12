FROM node:gallium-alpine

WORKDIR /app

COPY package.json /app

RUN npm install -f

COPY . .

ENV NEXT_PUBLIC_AUTH_BACKEND_HOST=https://auth-server.gocharity.com.ng
ENV NEXT_PUBLIC_API_DOMAIN=gocharity.com.ng
ENV NEXT_PUBLIC_GOCHARITY_DOMAIN=https://gocharity.com.ng
ENV NEXT_PUBLIC_AUTH_BACKEND_KEY="fe132312b2fb42bebb044162ef40e3ce"
ENV NEXT_PUBLIC_ORPHANAGE_ACCOUNT_CLIENT_DOMAIN=https://account-server.gocharity.com.ng

RUN npm run build

EXPOSE 3000

CMD ["npx", "next", "start", "-p", "3000"]