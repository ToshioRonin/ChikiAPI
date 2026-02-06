FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY .env ./
RUN npx prisma generate

RUN mkdir -p uploads

EXPOSE 3001

CMD ["npm", "run", "dev"]