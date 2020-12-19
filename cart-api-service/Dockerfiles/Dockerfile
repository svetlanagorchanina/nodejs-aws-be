FROM node:12-alpine AS base

WORKDIR /app


FROM base AS dependencies

COPY package*.json ./

RUN npm install


FROM base AS builder

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN npm run build
RUN npm prune --production


FROM base AS release

USER node

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "dist/main.js"]
