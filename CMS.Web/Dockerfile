FROM node:alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./

# Disable strict SSL to bypass self-signed certificate errors
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

RUN yarn install --frozen-lockfile --network-timeout 1000000

COPY . .

RUN yarn build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
