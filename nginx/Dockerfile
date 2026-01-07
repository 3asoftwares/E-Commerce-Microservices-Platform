# Nginx Dockerfile for Production
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Create directories for static files
RUN mkdir -p /usr/share/nginx/html/admin
RUN mkdir -p /usr/share/nginx/html/seller

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
