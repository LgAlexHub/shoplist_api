import { ShoppingList } from "../../domain/entities/shoppingList.ts";
import { ShoppingListRepository } from "../../domain/repositories/shoppingListRespository.ts";

export interface CreateShoppingListDTO {
    name? : string,
}

export class CreateShoppingListUseCase {
    constructor(private shoppingListRepository : ShoppingListRepository) {}

    async execute(dto : CreateShoppingListDTO){
        const shoppingList = new ShoppingList({
            name : dto.name,
        });
        await this.shoppingListRepository.save(shoppingList);
        return shoppingList.id;
    }
}