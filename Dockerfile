FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN cat package.json

RUN npx prisma generate

RUN ls -la
RUN cat package.json
RUN npm run
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]