// Bun.js server implementation for the Pokémon identification tool

import { serve } from "bun";
import { readFileSync } from "fs";
import { join } from "path";

// Define TypeScript interfaces
interface Pokemon {
  id: number;
  name: string;
  types: string[];
  image: string;
}

interface PokemonWithConfidence extends Pokemon {
  confidence: number;
}

interface ApiSuccessResponse {
  success: true;
  pokemon: PokemonWithConfidence;
}

interface ApiErrorResponse {
  success: false;
  error: string;
  code: string;
}

type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

// Mock database of Pokémon
const pokemonDb: Pokemon[] = [
  {
    id: 25,
    name: "Pikachu",
    types: ["Electric"],
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
  },
  {
    id: 1,
    name: "Bulbasaur",
    types: ["Grass", "Poison"],
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
  },
  {
    id: 4,
    name: "Charmander",
    types: ["Fire"],
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png"
  },
  {
    id: 7,
    name: "Squirtle",
    types: ["Water"],
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png"
  },
  {
    id: 143,
    name: "Snorlax",
    types: ["Normal"],
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png"
  }
];

// Simple image processing mock function (in a real app, this would use ML)
async function identifyPokemon(imageBuffer: ArrayBuffer): Promise<PokemonWithConfidence> {
  // Simulate processing delay
  await new Promise<void>(resolve => setTimeout(resolve, 1500));
  
  // Randomly select a Pokémon from our database
  const randomIndex = Math.floor(Math.random() * pokemonDb.length);
  const pokemon = pokemonDb[randomIndex];
  
  // Add a confidence score
  return {
    ...pokemon,
    confidence: 0.85 + (Math.random() * 0.14) // Random confidence between 85% and 99%
  };
}

// Content type mapping
const contentTypes: Record<string, string> = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".ts": "text/typescript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".json": "application/json"
};

// Serve static files
function serveStatic(path: string): Response {
  try {
    const filePath = join(import.meta.dir, "public", path);
    const file = readFileSync(filePath);
    const ext = path.substring(path.lastIndexOf("."));
    
    return new Response(file, {
      headers: {
        "Content-Type": contentTypes[ext] || "text/plain"
      }
    });
  } catch (e) {
    return new Response("File not found", { status: 404 });
  }
}

interface IdentifyRequestBody {
  imageUrl: string;
}

const server = serve({
  port: 3000,
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const path = url.pathname;
    
    // Handle API requests
    if (path === "/api/upload" && req.method === "POST") {
      try {
        const formData = await req.formData();
        const image = formData.get("image") as File | null;
        
        if (!image) {
          return Response.json({
            success: false,
            error: "No image provided",
            code: "NO_IMAGE"
          } as ApiErrorResponse, { status: 400 });
        }
        
        // Get image buffer
        const buffer = await image.arrayBuffer();
        
        // Identify Pokémon
        const pokemon = await identifyPokemon(buffer);
        
        return Response.json({
          success: true,
          pokemon
        } as ApiSuccessResponse);
      } catch (error) {
        console.error("Upload error:", error);
        return Response.json({
          success: false,
          error: "Failed to process image",
          code: "PROCESSING_ERROR"
        } as ApiErrorResponse, { status: 500 });
      }
    }
    
    // Handle API endpoint for URL-based identification
    if (path === "/api/identify" && req.method === "POST") {
      try {
        const body = await req.json() as IdentifyRequestBody;
        const { imageUrl } = body;
        
        if (!imageUrl) {
          return Response.json({
            success: false,
            error: "No image URL provided",
            code: "NO_URL"
          } as ApiErrorResponse, { status: 400 });
        }
        
        // Validate URL format
        try {
          new URL(imageUrl);
        } catch (e) {
          return Response.json({
            success: false,
            error: "Invalid image URL format",
            code: "INVALID_URL"
          } as ApiErrorResponse, { status: 400 });
        }
        
        // In a real app, we would fetch and process the image from the URL
        // Mock the identification process
        const randomIndex = Math.floor(Math.random() * pokemonDb.length);
        const pokemon = {
          ...pokemonDb[randomIndex],
          confidence: 0.85 + (Math.random() * 0.14)
        };
        
        return Response.json({
          success: true,
          pokemon
        } as ApiSuccessResponse);
      } catch (error) {
        console.error("API error:", error);
        return Response.json({
          success: false,
          error: "Failed to process request",
          code: "PROCESSING_ERROR"
        } as ApiErrorResponse, { status: 500 });
      }
    }
    
    // Serve static files
    if (path === "/" || path === "") {
      return serveStatic("index.html");
    }
    
    if (path.includes(".")) {
      return serveStatic(path.substring(1));
    }
    
    return serveStatic(`${path.substring(1)}.html`);
  }
});

console.log(`Server running at http://localhost:${server.port}`);