FROM node 

ENV SEC_BELT_HOME /usr/local/security-belt
ENV NODE_ENV production

WORKDIR $SEC_BELT_HOME

COPY package.json $SEC_BELT_HOME

RUN npm install

COPY . $SEC_BELT_HOME

USER nobody

ENTRYPOINT ["npm", "start"]
