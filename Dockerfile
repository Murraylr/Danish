# Set the base image from Docker repository to build our app. In this case we want to use node image to run our node app
FROM node:18.16.0-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . ./src

COPY tsconfig.json ./tsconfig.json

# Expose port 3000, and start the app.
EXPOSE 3000
CMD ["npm", "run", "start"]