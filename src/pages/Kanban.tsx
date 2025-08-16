import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import KanbanBoard, { TodoStatus } from "@/components/KanbanBoard";

interface TodoItem {
  _id?: string;
  text: string;
  category: "task" | "reminder" | "goal";
  status?: TodoStatus;
  dueDate?: Date;
  createdAt?: Date;
  comments?: { text: string; createdAt?: Date }[];
  [key: string]: unknown;
}

interface RawItem
  extends Omit<TodoItem, "dueDate" | "createdAt" | "comments"> {
  dueDate?: string;
  createdAt?: string;
  comments?: { text: string; createdAt?: string }[];
}

const parseDates = (item: RawItem): TodoItem => ({
  ...item,
  createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
  dueDate: item.dueDate ? new Date(item.dueDate) : undefined,
  comments: item.comments
    ? item.comments.map(c => ({
        ...c,
        createdAt: c.createdAt ? new Date(c.createdAt) : undefined,
      }))
    : [],
});

const KanbanPage = () => {
  const [items, setItems] = useState<TodoItem[]>([]);

  const fetchItems = async () => {
    const res = await fetch("/api/items?userId=user1");
    const data = await res.json();
    setItems(data.map(parseDates));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const updateStatus = async (id: string, status: TodoStatus) => {
    const item = items.find(i => i._id === id);
    if (!item) return;
    const res = await fetch(`/api/items/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, status }),
    });
    const updated = await res.json();
    setItems(prev => prev.map(i => (i._id === id ? parseDates(updated) : i)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <Navigation />
      <div className="p-4 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Kanban Board</h1>
        <KanbanBoard items={items} onStatusChange={updateStatus} />
      </div>
    </div>
  );
};

export default KanbanPage;
