## Proxy Service


### Pre-requirements
- Docker installed locally. [Debian](https://docs.docker.com/engine/install/debian/)
  or [Ubuntu](https://docs.docker.com/engine/install/ubuntu/) or other distributive.
- Docker Compose installed locally [installation link](https://docs.docker.com/compose/install/).

### Installing for running Via Docker

A step-by-step series of examples that tell you how to get a development env running.

- Copy the .env file and set up environment variables. Replace all 'xxx' with real credentials:

```bash
$ cp .env.sample .env
```

## Running the app via docker-compose

```bash
docker-compose up --build 
```

### Endpoint:
```bash
curl --location --request GET 'http://localhost:8080/api' \
--header 'Content-Type: application/json'
```

## Installing for locally running

A step-by-step series of examples that tell you how to get a development env running.

- Copy the .env file and set up environment variables. Replace all 'xxx' with real credentials:

```bash
$ cp .env.sample .env
```

- Install global dependencies:

```bash
$ npm install -g @nestjs/cli typescript
```

### Running the app locally

```bash
npm run start
```

### Endpoint: 
```bash
curl --location --request GET 'http://localhost/api' \
--header 'Content-Type: application/json'
```

## Running tests

### Unit tests

```bash
$ npm run test:unit
```

### Integration tests

```bash
$ npm run test:integration
```
