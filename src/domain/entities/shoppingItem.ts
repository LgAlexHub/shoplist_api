import { uuid } from "../../../deps.ts";

export interface ShoppingItemArgs {
    id? : string,
    shopListId : string,
    name : string,
    quantity? : number
}

export class ShoppingItem {
    public id:string;
    public shopListId:string;
    public name:string;
    public quantity:number;

    constructor(args : ShoppingItemArgs){
        this.id = uuid.validate(args.id ?? '') ? args.id! : uuid.v1.generate();
        this.shopListId = args.shopListId;
        if (args.name.trim()?.length < 3){
            throw new Error('Name property should be longer than 3 characters');
        }
        if (!args.quantity){
            this.quantity = 1;
        } else if (args.quantity < 1){
            throw new Error('Quantity property should be positive');
        } else {
            this.quantity = args.quantity!;
        }
        this.name = args.name;
    }
}