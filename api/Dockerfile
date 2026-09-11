FROM node:22-alpine AS frontend
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY index.html tsconfig*.json vite.config.ts eslint.config.js ./
COPY scripts ./scripts
COPY public ./public
COPY src ./src
RUN npm run build

FROM golang:1.24-alpine AS build
WORKDIR /src/api
COPY api/go.mod api/go.sum api/main.go ./
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /publishing-api .

FROM alpine:3.22
RUN addgroup -S app && adduser -S -G app app && mkdir /data && chown app:app /data
USER app
COPY --from=build /publishing-api /usr/local/bin/publishing-api
COPY --from=frontend /src/dist /app/dist
EXPOSE 8081
ENTRYPOINT ["publishing-api"]
