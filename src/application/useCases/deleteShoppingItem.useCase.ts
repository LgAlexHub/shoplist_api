import { ShoppingList } from "../../domain/entities/shoppingList.ts";
import { ShoppingListRepository } from "../../domain/repositories/shoppingListRespository.ts";


export class DeleteShoppingItemUseCase {
    constructor(private shoppingListRepository : ShoppingListRepository) {}

    async execute(shopListId : string, itemListId : string) : Promise<ShoppingList> {
        const list = await this.shoppingListRepository.findById(shopListId);
        if (!list)
            throw new Error(`Shopping list ${shopListId} not found`);
        try {
            list.deleteItem(itemListId);
            await this.shoppingListRepository.save(list);
            return list;
        } catch (error) {
            throw error;
        }
    }
}