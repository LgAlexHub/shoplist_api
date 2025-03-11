import { CreateShoppingListUseCase } from "../../../../application/useCases/createShoppingList.useCase.ts";
import { Context, Router, RouterContext } from "../../../../../deps.ts";
import { CreateShoppingItemUseCase } from "../../../../application/useCases/createShoppingItem.useCase.ts";
import { GetShoppingListUseCaseById } from "../../../../application/useCases/getShoppingListById.useCase.ts";
import { DeleteShoppingItemUseCase } from "../../../../application/useCases/deleteShoppingItem.useCase.ts";
import { AuthMiddleware } from "../middlewares/auth.middleware.ts";

export class ShoppingListController {
  constructor(
    private createShoppingListUseCase: CreateShoppingListUseCase,
    private createShoppingItemUseCase: CreateShoppingItemUseCase,
    private getShoppingListByIdUseCase: GetShoppingListUseCaseById,
    private deleteShoppingItemUseCase: DeleteShoppingItemUseCase,
    private authMiddleWare: AuthMiddleware
  ) {}

  public setUpRoutes(router: Router): void {
    router
      .post("/lists", this.authMiddleWare.authenticate, this.createList.bind(this))
      .post("/lists/:id/items", this.authMiddleWare.authenticate, this.addItem.bind(this))
      .delete("/lists/:id/items/:itemId", this.authMiddleWare.authenticate, this.deleteItem.bind(this));
  }

  private async deleteItem(ctx: RouterContext<"/lists/:id/items/:itemId">){
    const [listId, itemId] = [ctx.params.id, ctx.params.itemId];
    let shoppingList = await this.getShoppingListByIdUseCase.execute(listId);
    if (!shoppingList){
      ctx.response.status = 404;
      return;
    }
    try {
      shoppingList = await this.deleteShoppingItemUseCase.execute(listId, itemId);
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = JSON.stringify({ error: error }, null, 2);
    }
    ctx.response.status = 200;
    ctx.response.body = JSON.stringify(shoppingList, null, 2);
  }

  private async addItem(ctx: RouterContext<"/lists/:id/items">): Promise<void> {
    const listId = ctx.params.id;
    let shoppingList = await this.getShoppingListByIdUseCase.execute(listId);
    if (!shoppingList) {
      ctx.response.status = 404;
      return;
    }
    try {
      const body = await ctx.request.body.json();
      shoppingList = await this.createShoppingItemUseCase.execute({
        listId: listId,
        name: body.name,
        quantity : body.quantity
      });
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = JSON.stringify({ error: error }, null, 2);
    }
    ctx.response.status = 200;
    ctx.response.body = JSON.stringify(shoppingList, null, 2);
  }

  private async createList(ctx: Context): Promise<void> {
    try {
      const body = await ctx.request.body.json();
      const listId = await this.createShoppingListUseCase.execute({
        name: body.name,
      });
      ctx.response.status = 201;
      ctx.response.body = { id: listId };
    } catch (error: unknown) {
      ctx.response.status = 500;
      ctx.response.body = JSON.stringify({ error: error }, null, 2);
    }
  }
}
