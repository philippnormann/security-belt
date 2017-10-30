FROM node 

ENV SEC_BELT_HOME /home/node/security-belt
ENV NODE_ENV production

WORKDIR $SEC_BELT_HOME

COPY . $SEC_BELT_HOME

RUN chown -R node $SEC_BELT_HOME

RUN npm install

USER node

ENTRYPOINT ["npm", "start"]
