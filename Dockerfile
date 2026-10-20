
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY front1.html /usr/share/nginx/html/index.html
COPY front1.css /usr/share/nginx/html/front1.css
COPY script1.js /usr/share/nginx/html/script1.js

EXPOSE 10000

CMD ["nginx", "-g", "daemon off;"]
