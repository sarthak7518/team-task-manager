FROM node:20-slim

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

RUN cd backend && npm install && cd ../frontend && npm install

RUN cd frontend && npm run build

RUN cd backend && npx prisma generate && npx tsc

RUN cp -r frontend/dist backend/dist/public

WORKDIR /app/backend

EXPOSE 8080

CMD ["sh", "-c", "npx prisma db push --skip-generate && node dist/server.js"]
