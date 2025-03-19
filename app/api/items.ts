import { Item } from '../types';

const API_URL = 'https://jsonplaceholder.typicode.com';

export async function getItems(): Promise<Item[]> {
  const response = await fetch(`${API_URL}/posts`);
  if (!response.ok) throw new Error('Failed to fetch items');
  const data = await response.json();
  return data.slice(0, 10).map((item: any) => ({
    id: item.id,
    title: item.title,
    description: item.body,
  }));
}

export async function createItem(item: Omit<Item, 'id'>): Promise<Item> {
  const response = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    body: JSON.stringify(item),
    headers: {
      'Content-type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to create item');
  return response.json();
}

export async function updateItem(item: Item): Promise<Item> {
  const response = await fetch(`${API_URL}/posts/${item.id}`, {
    method: 'PUT',
    body: JSON.stringify(item),
    headers: {
      'Content-type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to update item');
  return response.json();
}

export async function deleteItem(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/posts/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete item');
}