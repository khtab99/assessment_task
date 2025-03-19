"use client";

import { useState, useEffect } from "react";
import { Item } from "./types";
import { ItemList } from "./components/ItemList";
import { ItemForm } from "./components/ItemForm";
import { getItems, createItem, updateItem, deleteItem } from "./api/items";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const data = await getItems();
      setItems(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch items");
      toast({
        title: "Error",
        description: "Failed to fetch items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreate(newItem: Omit<Item, "id">) {
    try {
      const created = await createItem(newItem);
      setItems((prev) => [...prev, created]);
      toast({
        title: "Success",
        description: "Item created successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create item",
        variant: "destructive",
      });
    }
  }

  async function handleUpdate(updatedItem: Item) {
    try {
      await updateItem(updatedItem);
      setItems((prev) =>
        prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      );
      toast({
        title: "Success",
        description: "Item updated successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Item List</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Item</DialogTitle>
            </DialogHeader>
            <ItemForm onSubmit={handleCreate} />
          </DialogContent>
        </Dialog>
      </div>

      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      ) : (
        <ItemList
          items={items}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
