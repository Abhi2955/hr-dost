import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo } from "react";
import { Link } from "react-router-dom";

export type TodoStatus = "todo" | "in-progress" | "completed" | "on-hold";
export type ItemCategory = "task" | "reminder" | "goal";

interface TodoItem {
  _id?: string;
  text: string;
  category: ItemCategory;
  status?: TodoStatus;
  comments?: { text: string; createdAt?: Date }[];
}

interface KanbanBoardProps {
  items: TodoItem[];
  onStatusChange: (id: string, status: TodoStatus) => void;
}

const columns: { key: TodoStatus; title: string }[] = [
  { key: "todo", title: "To Do" },
  { key: "in-progress", title: "In Progress" },
  { key: "on-hold", title: "On Hold" },
  { key: "completed", title: "Completed" },
];

export default function KanbanBoard({ items, onStatusChange }: KanbanBoardProps) {
  const groups = useMemo(() => {
    return columns.map(col => ({
      ...col,
      items: items.filter(i => (i.status ?? "todo") === col.key),
    }));
  }, [items]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: TodoStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (id) onStatusChange(id, status);
  };

  return (
    <div className="flex gap-4 overflow-x-auto">
      {groups.map(col => (
        <div
          key={col.key}
          className="space-y-2 w-72 flex-shrink-0 bg-background/60 p-2 rounded-md shadow"
          onDragOver={e => e.preventDefault()}
          onDrop={e => handleDrop(e, col.key)}
        >
          <h3 className="text-lg font-semibold">{col.title}</h3>
          {col.items.map(item => (
            <Card
              key={item._id}
              className="p-2 space-y-2 bg-card"
              draggable
              onDragStart={e => item._id && handleDragStart(e, item._id)}
            >
              <div className="font-medium">{item.text}</div>
              <Select
                value={item.status ?? "todo"}
                onValueChange={v => item._id && onStatusChange(item._id, v as TodoStatus)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">Todo</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              {item._id && (
                <Link
                  to={`/items/${item._id}/comments`}
                  className="text-xs text-muted-foreground underline"
                >
                  Comments ({item.comments?.length ?? 0})
                </Link>
              )}
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
}
