'use client';

import { useState } from 'react';
import { Item } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ItemForm } from './ItemForm';

interface ItemListProps {
  items: Item[];
  onDelete: (id: number) => void;
  onUpdate: (item: Item) => void;
}

export function ItemList({ items, onDelete, onUpdate }: ItemListProps) {
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [sortBy, setSortBy] = useState<'title' | 'id'>('id');
  const [filterText, setFilterText] = useState('');

  const sortedAndFilteredItems = items
    .filter(
      (item) =>
        item.title.toLowerCase().includes(filterText.toLowerCase()) ||
        item.description.toLowerCase().includes(filterText.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return a.id - b.id;
    });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <input
          type="text"
          placeholder="Filter items..."
          className="w-full sm:w-64 px-4 py-2 border rounded-lg"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <select
          className="w-full sm:w-auto px-4 py-2 border rounded-lg"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'title' | 'id')}
        >
          <option value="id">Sort by ID</option>
          <option value="title">Sort by Title</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedAndFilteredItems.map((item) => (
          <Card key={item.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span className="truncate">{item.title}</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditItem(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          {editItem && (
            <ItemForm
              initialData={editItem}
              onSubmit={(data) => {
                onUpdate({ ...data, id: editItem.id });
                setEditItem(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}