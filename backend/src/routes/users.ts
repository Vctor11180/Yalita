import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { UserService } from "../services/UserService";
import { authMiddleware } from "../middleware/auth";

export const userRoutes = new Hono();
const userService = new UserService();

const registerSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  phoneNumber: z.string().optional(),
  email: z.string().email().optional(),
  firstName: z.string().min(1).max(50).optional(),
  ci: z.string().regex(/^\d{4}$/).optional(),
});

userRoutes.post("/register", zValidator("json", registerSchema), async (c) => {
  const body = c.req.valid("json");
  const user = await userService.registerOrGet({
    ...body,
    walletAddress: body.walletAddress as `0x${string}`,
  });
  return c.json(user);
});

userRoutes.get("/me", authMiddleware, async (c) => {
  const walletAddress = c.get("walletAddress") as `0x${string}`;
  const user = await userService.getByWallet(walletAddress);
  return c.json(user);
});
