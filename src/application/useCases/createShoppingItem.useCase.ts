import { ShoppingItem } from "../../domain/entities/shoppingItem.ts";
import { ShoppingList } from "../../domain/entities/shoppingList.ts";
import { ShoppingListRepository } from "../../domain/repositories/shoppingListRespository.ts";

export interface AddItemDTO {
    listId : string,
    name : string,
    quantity? : number,
}

export class CreateShoppingItemUseCase {
    constructor(private shoppingListRepository : ShoppingListRepository) {}

    async execute(dto : AddItemDTO) : Promise<ShoppingList> {
        const list = await this.shoppingListRepository.findById(dto.listId);
        if (!list)
            throw new Error(`Shopping list ${dto.listId} not found`);
        try {
            const item = new ShoppingItem({
                name : dto.name,
                quantity : dto.quantity
            });
            list.addItem(item);
            await this.shoppingListRepository.save(list);
            return list;
        } catch (error) {
            throw error;
        }
    }
}