FROM mcr.microsoft.com/playwright:v1.25.0-focal


COPY . /app/
WORKDIR /app/

RUN npm install

# Entrypoint
CMD npm run start