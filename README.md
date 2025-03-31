# Pokemon Image Classifier Web App with API

This is a **Pokemon Image Classifier Web App** that uses Bun for fast development and runtime. The app includes an **AI API** for classifying images of Pokémon and is optimized for **production** environments.

This project was created using `bun init` in **Bun v1.2.7**. Bun is a fast all-in-one JavaScript runtime.

## Prerequisites

Ensure you have the following installed:

- [Bun](https://bun.sh/) - A fast JavaScript runtime like Node.js but faster
- [TypeScript](https://www.typescriptlang.org/) (optional, if you want to compile manually)

## Installation

Install dependencies using Bun:

```sh
bun install
```

## Running the App

### Development Environment

To run the app in **development** mode, use the following command:

```sh
bun run index.ts
```

This will start the server and you can begin testing the app locally.

### Production Environment

For **production**, ensure your environment is set up, then start the server with:

```sh
bun run index.ts
```

## API Access

The app exposes an **AI API** for classifying Pokémon images.  
To interact with the API, send a **POST** request to:

```
/api/classify
```

Include the image file in your request, and the API will return a classification.

## Project Structure

```
/pokemon-image-classifier
│── index.ts        # Main entry file to run the web app
│── /src            # Contains all other code (API logic, models, utilities)
│── /node_modules   # Dependencies installed via Bun
│── bun.lockb       # Bun lock file for dependencies
│── tsconfig.json   # TypeScript configuration
│── package.json    # Project metadata and scripts
```

## Deployment

For production deployment, you can host this app on any cloud platform (e.g., **Vercel, DigitalOcean, AWS**). The app is optimized for fast server-side rendering and minimal overhead.
