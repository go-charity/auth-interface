FROM node:gallium-alpine

WORKDIR /app

COPY package.json /app

RUN npm install -f

COPY . .

# ENV NEXT_PUBLIC_AUTH_BACKEND_HOST=auth-server-service.default:5000
ENV NEXT_PUBLIC_AUTH_BACKEND_HOST=/api
ENV NEXT_PUBLIC_API_DOMAIN=localhost
ENV AUTH_BACKEND_HOST=http://localhost:6000/:path*

RUN npm run build

EXPOSE 3000

CMD ["npx", "next", "start", "-p", "3000"]