import Fastify from "fastify";
import cors from "@fastify/cors";
import { z } from "zod";

console.log("Starting server...");

const app = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
    },
  },
});

await app.register(cors, {
  origin: "http://localhost:3000",
});

const UserSchema = z.object({
  name: z.string().min(2, "Imię musi mieć przynajmniej 2 znaki"),
  password: z
    .string()
    .min(8, "Hasło musi mieć przynajmniej 8 znakow")
    .regex(/\d/, "Hasło musi zawierać co najmniej jedną cyfrę"),
  age: z.number().min(12).max(99),
  birthDate: z.string().refine((val) => {
    if (!val) return false;
    const date = new Date(val);
    return date < new Date();
  }, "Data musi być w przeszłości"),
  phone: z.string().min(9),
  agreed: z
    .boolean()
    .refine((val) => val === true, "Musisz zaakceptować regulamin"),
  rating: z.number().min(0).max(5),
  bio: z.string().min(10),
});

app.post("/register", async (req, rep) => {
  const result = UserSchema.safeParse(req.body);

  if (!result.success) {
    return rep.status(400).send({ error: result.error.flatten().fieldErrors });
  }

  return rep.send({ success: true, name: result.data.name });
});

await app.listen({ port: 3001 });
