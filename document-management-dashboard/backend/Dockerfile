# Use Node.js Alpine base image
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy dependency files
COPY package*.json ./
COPY prisma ./prisma/

# Install packages
RUN npm ci

# Copy server code
COPY . .

# Generate Prisma client and compile TypeScript
RUN npx prisma generate
RUN npm run build

# Production Environment
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

# Copy built code and prisma
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/node_modules/@prisma/client ./node_modules/@prisma/client

# Create uploads folder
RUN mkdir -p uploads

EXPOSE 5001

ENV NODE_ENV=production
ENV PORT=5001

# Boot script
CMD ["sh", "-c", "npx prisma db push && node dist/index.js"]
