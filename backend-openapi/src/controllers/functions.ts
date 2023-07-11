import { Response } from "express";

export function handleInternalServerError(res: Response, ex: any) {
  res.status(500).json(ex?.message ?? "unknown error");
}
