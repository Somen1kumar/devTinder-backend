


to update code
- git pull
- to start server 
    - pm2 start npm -- start /  in src directory:- pm2 start apps.js --name myapp
    - pm2 logs
    - pm2 list
    - pm2 stop <nameofLog>
    - pm2 delete <nameofLog>

- to change to configs so that FE and API URL is same and port is replaced with /api/
    append nginx file by writing command
    -  sudo nano /etc/nginx/sites-available/default

config file :-/------------------------start-----------------------------------

server-name: 13.54.80.181/
location /api/ {
        proxy_pass http://localhost:3000/;
        
        # Standard proxy headers to pass real client info to your backend
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Optional: WebSockets support (if your API uses Socket.io, WS, etc.)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

config file end ---------------end-----------------------------------

after adding it save the file by exiting 
- sudo systemctl restart nginx