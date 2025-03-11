import {
  Application,
  MongoClient,
  oakCors,
  Router,
  ServerApiVersion,
} from "../../deps.ts";
import { ShoppingListController } from "../adapters/primary/rest/controllers/shoppingLIst.controller.ts";
import { AuthMiddleware, TokenAuthService } from "../adapters/primary/rest/middlewares/auth.middleware.ts";
import { MongoDBShoppingListRepository } from "../adapters/secondary/mongodb.shoppingList.repository.ts";
import { CreateShoppingItemUseCase } from "../application/useCases/createShoppingItem.useCase.ts";
import { CreateShoppingListUseCase } from "../application/useCases/createShoppingList.useCase.ts";
import { DeleteShoppingItemUseCase } from "../application/useCases/deleteShoppingItem.useCase.ts";
import { GetShoppingListUseCaseById } from "../application/useCases/getShoppingListById.useCase.ts";

export class Server {
  private app: Application;
  private router: Router;
  private mongoDBClient: MongoClient;
  constructor() {
    this.app = new Application();
    this.router = new Router();
    const uri = Deno.env.get('MONGODB_URI') ?? 'mongodb+srv://';
    this.mongoDBClient = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
}

  async initialize(): Promise<void> {
    try {
      await this.mongoDBClient.connect();
    } catch (error) {
        console.error(error);
    }
    const shoppingListRepository = new MongoDBShoppingListRepository(
      this.mongoDBClient,
    );

    const authMiddleWare = new AuthMiddleware((new TokenAuthService));

    const createShoppingItemUseCase = new CreateShoppingItemUseCase(
      shoppingListRepository,
    );
    const createShoppingListUseCase = new CreateShoppingListUseCase(
      shoppingListRepository,
    );
    const getShoppingListByIdUseCase = new GetShoppingListUseCaseById(
      shoppingListRepository
    );

    const deleteShoppingItemUseCase = new DeleteShoppingItemUseCase(
      shoppingListRepository
    )

    const shoppingListController = new ShoppingListController(
      createShoppingListUseCase,
      createShoppingItemUseCase,
      getShoppingListByIdUseCase,
      deleteShoppingItemUseCase,
      authMiddleWare
    );

    shoppingListController.setUpRoutes(this.router);
    this.app.use(oakCors());
    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());
    this.app.use(async (ctx, next) => {
      try {
        await next();
      } catch (err) {
        ctx.response.status = 500;
        ctx.response.type = "application/json; charset=utf-8";
        ctx.response.body = { error: err };
        console.error(err);
      }
    });
  }

  async start(port = 8000): Promise<void> {
    await this.initialize();
    console.log(`Server running on http://localhost:${port}`);
    await this.app.listen({ port });
  }
}
