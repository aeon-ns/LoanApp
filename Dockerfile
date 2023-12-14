FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# *** Uncomment below for first load only
# RUN npx migrate:latest && echo "DB Migrations ran successfully"
# RUN npx seed:run && echo "DB Seeds ran successfully"

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]