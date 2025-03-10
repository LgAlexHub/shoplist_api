import { ShoppingListRepository } from "../../domain/repositories/shoppingListRespository.ts";

export class GetShoppingListUseCaseById {
    constructor(private shoppingListRepository : ShoppingListRepository) {}

    async execute(shopListId : string){
        return await this.shoppingListRepository.findById(shopListId);
    }
}