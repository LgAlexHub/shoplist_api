import { ShoppingList } from "../../domain/entities/shoppingList.ts";
import { Collection, MongoClient } from "../../../deps.ts";
import { ShoppingListRepository } from "../../domain/repositories/shoppingListRespository.ts";

export class MongoDBShoppingListRepository implements ShoppingListRepository {
  private collection: Collection<ShoppingList>;

  constructor(client: MongoClient) {
    const db = client.db("shopping_app");
    this.collection = db.collection<ShoppingList>("shopping_lists");
  }

  async findById(id: string): Promise<ShoppingList | null> {
    const doc = await this.collection.findOne({ id });
    if (!doc) return null;
    return new ShoppingList({
      id: doc.id,
      name: doc.name,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      items: doc.items,
    });
  }

  async findAll(): Promise<ShoppingList[]> {
    const docs = await this.collection.find().toArray();
    return docs.map(doc => new ShoppingList({
        id : doc.id,
        name : doc.name,
        createdAt : doc.createdAt,
        updatedAt : doc.updatedAt,
        items : doc.items,
    }));
  }

  async save(shoppingList: ShoppingList): Promise<void> {
    await this.collection.updateOne({
      id: shoppingList.id,
    }, {
      $set: {
        ...shoppingList,
      },
    }, { upsert: true });
  }

  async delete(shopListId: string): Promise<boolean> {
    const result = await this.collection.deleteOne({id : shopListId});
    return result.deletedCount > 0;
  }

}
