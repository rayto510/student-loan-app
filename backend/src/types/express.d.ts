import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: number;
      // add other properties you attach to req.user if any
    };
  }
}

declare module "express" {
  export interface Request {
    user?: {
      id: number;
      name?: string;
      email?: string;
    };
  }
}
