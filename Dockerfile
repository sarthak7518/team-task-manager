FROM node:20-alpine

WORKDIR /app

# Copy everything
COPY . .

# Install dependencies
RUN cd backend && npm install && cd ../frontend && npm install

# Build frontend
RUN cd frontend && npm run build

# Build backend
RUN cd backend && npx prisma generate && npx tsc

# Copy frontend into backend/dist/public
RUN cp -r frontend/dist backend/dist/public

WORKDIR /app/backend

EXPOSE 8080

CMD ["sh", "-c", "npx prisma db push --skip-generate && node dist/server.js"]
