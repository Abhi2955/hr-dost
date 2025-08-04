import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo } from "react";

export type TodoStatus = "todo" | "in-progress" | "completed" | "on-hold";
export type ItemCategory = "task" | "reminder" | "goal";

interface TodoItem {
  _id?: string;
  text: string;
  category: ItemCategory;
  status?: TodoStatus;
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

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      {groups.map(col => (
        <div key={col.key} className="space-y-2">
          <h3 className="text-lg font-semibold">{col.title}</h3>
          {col.items.map(item => (
            <Card key={item._id} className="p-2 space-y-2 bg-card">
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
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
}
