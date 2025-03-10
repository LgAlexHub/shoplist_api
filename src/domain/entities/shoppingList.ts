import { uuid } from "../../../deps.ts";
import { ShoppingItem } from "./shoppingItem.ts";

export interface ShoppingListArgs {
    id? : string,
    name? : string,
    createdAt? : Date,
    updatedAt? : Date,
    items? : ShoppingItem[],
}

export class ShoppingList {
    public id:string;
    public name:string;
    public items: ShoppingItem[];
    public createdAt:Date;
    public updatedAt:Date;

    constructor(args : ShoppingListArgs){
        this.createdAt = args.createdAt ?? new Date();
        this.updatedAt = args.updatedAt ?? new Date();
        this.id = uuid.validate(args.id ?? '') ? args.id! : uuid.v1.generate();
        const defaultListName = `Liste du ${this.createdAt.getDate()}/${this.createdAt.getMonth() + 1}/${this.createdAt.getFullYear()}`;  
        if (!args.name)
            this.name = defaultListName;
        else if (args.name.trim()?.length < 3){
            throw new Deno.errors.InvalidData('Name property should be longer than 3 characters');
        }else {
            this.name = args.name;
        }
        this.items = args.items ?? [];
    }

    public addItem(item : ShoppingItem) : void {
        const itemIndex = this.items.findIndex(ShoppingItem => ShoppingItem.name === item.name);
        if (itemIndex === -1)
            this.items.push(item);
        else
            this.items[itemIndex].quantity = item.quantity
        this.updateTimestamp();
    }

    public deleteItem(itemId : string) : boolean {
        const itemIndex = this.items.findIndex(shopItem => shopItem.id === itemId);
        if (itemIndex === -1) {
            return false;
        }
        const deleteResult = this.items.splice(itemIndex, 1).length > 0;
        if(deleteResult)
            this.updateTimestamp();
        return deleteResult;
    }

    protected updateTimestamp(){
        this.updatedAt = new Date();
    }
}