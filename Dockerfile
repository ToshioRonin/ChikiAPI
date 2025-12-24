FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

# COPY prisma ./prisma
RUN npx prisma generate

RUN mkdir -p uploads

EXPOSE 3000

CMD ["npm", "run", "dev"]