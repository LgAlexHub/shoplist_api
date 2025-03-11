import { Context, Next } from "../../../../../deps.ts";
import { AuthentificationService } from "../../../../domain/services/authentification.service.ts";

export class TokenAuthService implements AuthentificationService {
  verifyToken(token: string): Promise<boolean> {
    return new Promise((resolve) =>
      resolve(token === Deno.env.get("MAIN_TOKEN"))
    );
  }
}

export class AuthMiddleware {
  constructor(private authentificationService: AuthentificationService) {}

  authenticate = async (ctx: Context, next: Next) => {
    try {
      const authHeader = ctx.request.headers.get("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("No auth header");
      }
      const token = authHeader.substring(7);
      const isAuth = await this.authentificationService.verifyToken(token);
      if (!isAuth) {
        throw new Error("Bad token");
      }
      await next();
    } catch (error) {
      console.error(error);
      ctx.response.status = 401;
      ctx.response.body = JSON.stringify({
        status: 401,
        messages: 'Unauthenticated',
      });
      return;
    }
  };
}
