
FROM nginx:alpine

COPY front1.html /usr/share/nginx/html/index.html
COPY front1.css /usr/share/nginx/html/front1.css
COPY script1.js /usr/share/nginx/html/script1.js

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
