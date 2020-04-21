FROM node:alpine
MAINTAINER Pushpam

LABEL description="YFTChain Middleware Docker file"

# Create app directory
WORKDIR /usr/src/app/

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY . .

# installing python & node-gyp

RUN apk --no-cache --virtual build-dependencies add \
    python \
    make \
    g++ \
    && npm install \
    && apk del build-dependencies


RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

EXPOSE 5004

CMD ["npm", "start"]

