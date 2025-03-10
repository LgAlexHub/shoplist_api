import { ShoppingList } from "../entities/shoppingList.ts";

export interface ShoppingListRepository {
    findById(id : string) : Promise<ShoppingList | null>;
    findAll() : Promise<ShoppingList[]>;
    save(shoppingList : ShoppingList): Promise<void>;
    delete(shopListId : string) : Promise<boolean>;
}