# Step 1: Node.js use karke Vite project build karein
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
# React 19 ke naye packages ke liye peer dependencies check loose kiya hai
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Step 2: Nginx server ke saath client par serve karein
FROM nginx:alpine
# Vite hamesha 'dist' folder banata hai
COPY --from=build /app/dist /usr/share/nginx/html
# Custom Nginx configuration ko copy karna
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
