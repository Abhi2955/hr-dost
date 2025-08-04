import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus, CheckCircle2, Circle, Calendar as CalendarIcon, MessageSquare, Clock, Play, Pause, Target, Gift, CheckSquare, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type TodoStatus = "todo" | "in-progress" | "completed" | "on-hold";
type ItemCategory = "task" | "reminder" | "goal";
type RecurrenceFrequency = "daily" | "weekly" | "monthly" | "yearly";
type Priority = "high" | "medium" | "low";

interface BaseItem {
  id: string;
  text: string;
  category: ItemCategory;
  createdAt: Date;
  tags?: string[];
}

interface TaskItem extends BaseItem {
  category: "task";
  status: TodoStatus;
  priority: Priority;
  dueDate?: Date;
  comments: { text: string; createdAt: Date }[];
}

interface GoalItem extends BaseItem {
  category: "goal";
  status: TodoStatus;
  priority: Priority;
  dueDate?: Date;
  comments: { text: string; createdAt: Date }[];
}

interface ReminderItem extends BaseItem {
  category: "reminder";
  dueDate?: Date;
  recurrence: {
    frequency: RecurrenceFrequency;
    isRecurring: boolean;
  };
  comments?: { text: string; createdAt: Date }[]; // for type safety
}

interface MongoItem {
  _id?: string;
}
type TodoItem = (TaskItem | GoalItem | ReminderItem) & MongoItem;

// Helper to parse date fields from backend
const parseDates = (item: any): TodoItem => ({
  ...item,
  createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
  dueDate: item.dueDate ? new Date(item.dueDate) : undefined,
  comments: item.comments
    ? item.comments.map((c: any) => ({ ...c, createdAt: c.createdAt ? new Date(c.createdAt) : undefined }))
    : [],
  tags: item.tags || [],
});

export default function TodoApp() {
  const [items, setItems] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState<string | null>(null); // item id or null
  const [editForm, setEditForm] = useState<any>(null); // holds the item being edited
  const [inputValue, setInputValue] = useState("");
  const [activeCategory, setActiveCategory] = useState<ItemCategory>("task");
  const [filter, setFilter] = useState<TodoStatus | "all">("all");
  const [newItemDueDate, setNewItemDueDate] = useState<Date>();
  const [newReminderFrequency, setNewReminderFrequency] = useState<RecurrenceFrequency>("monthly");
  const [isRecurring, setIsRecurring] = useState(false);
  const [newItemPriority, setNewItemPriority] = useState<Priority>("medium");
  const [newItemTags, setNewItemTags] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [editingItem, setEditingItem] = useState<(TaskItem | GoalItem & { _id?: string }) | null>(null);
  const [newComment, setNewComment] = useState("");
  const [tagSearch, setTagSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<{
    task: string;
    goal: string;
    reminder: string;
  }>({ task: "newest", goal: "newest", reminder: "newest" });
  const { toast } = useToast();

  // Fetch items from backend on mount
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/items?userId=user1");
      const data = await res.json();
      setItems(data.map(parseDates));
    } finally {
      setLoading(false);
    }
  };

  const addItem = async () => {
    if (inputValue.trim() === "") return;

    const baseItem = {
      text: inputValue.trim(),
      category: activeCategory,
      createdAt: new Date(),
      tags: newItemTags.split(',').map(t => t.trim()).filter(Boolean),
    };

    let newItem: any;
    
    if (activeCategory === "task") {
      newItem = {
        ...baseItem,
        category: "task",
        status: "todo" as TodoStatus,
        priority: newItemPriority,
        dueDate: newItemDueDate,
        comments: [],
      };
    } else if (activeCategory === "goal") {
      newItem = {
        ...baseItem,
        category: "goal",
        status: "todo" as TodoStatus,
        priority: newItemPriority,
        dueDate: newItemDueDate,
        comments: [],
      };
    } else {
      newItem = {
        ...baseItem,
        category: "reminder",
        dueDate: newItemDueDate,
        recurrence: {
          frequency: newReminderFrequency,
          isRecurring: isRecurring,
        },
      };
    }
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newItem, userId: "user1" }),
      });
      const saved = await res.json();
      console.log('Added item response:', saved);
      setItems(prev => [parseDates(saved), ...prev]);
    } catch (e) {
      toast({ title: "Error", description: "Failed to add item.", variant: "destructive" });
    }
    setInputValue("");
    setNewItemDueDate(undefined);
    setIsRecurring(false);
    setNewItemTags("");
    const categoryName = activeCategory === "task" ? "task" : activeCategory === "goal" ? "goal" : "reminder";
    toast({
      title: `${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} added!`,
      description: `Your new ${categoryName} has been added to the list.`,
    });
  };

  const updateItemStatus = async (id: string, status: TodoStatus) => {
    const item = items.find(i => i._id === id);
    if (!item) return;
    try {
      const res = await fetch(`/api/items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, status }),
      });
      const updated = await res.json();
      setItems(prev => prev.map(i => i._id === id ? parseDates(updated) : i));
    } catch (e) {
      toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
    }
  };

  const addItemComment = async (id: string, commentText: string) => {
    try {
      const res = await fetch(`/api/items/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: commentText, createdAt: new Date() }),
      });
      const updated = await res.json();
      setItems(prev => prev.map(i => i._id === id ? parseDates(updated) : i));
      toast({ title: "Comment added!", description: "Your comment has been saved." });
    } catch (e) {
      toast({ title: "Error", description: "Failed to add comment.", variant: "destructive" });
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await fetch(`/api/items/${id}`, { method: "DELETE" });
      setItems(prev => prev.filter(item => item._id !== id));
      toast({
        title: "Item deleted!",
        description: "Item has been removed from your list.",
        variant: "destructive",
      });
    } catch (e) {
      toast({ title: "Error", description: "Failed to delete item.", variant: "destructive" });
    }
  };

  // Edit dialog logic
  const openEditDialog = (item: any) => {
    setEditForm({ ...item, tags: item.tags ? item.tags.join(', ') : '' });
    setEditDialogOpen(item._id);
  };
  const closeEditDialog = () => {
    setEditDialogOpen(null);
    setEditForm(null);
  };
  const handleEditChange = (field: string, value: any) => {
    setEditForm((prev: any) => ({ ...prev, [field]: value }));
  };
  const saveEdit = async () => {
    if (!editForm || !editForm._id) return;
    try {
      const payload = {
        ...editForm,
        tags: typeof editForm.tags === 'string'
          ? editForm.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
          : editForm.tags,
      };
      const res = await fetch(`/api/items/${editForm._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const updated = await res.json();
      setItems(prev => prev.map(i => i._id === updated._id ? parseDates(updated) : i));
      closeEditDialog();
      toast({ title: "Item updated!", description: "Your changes have been saved." });
    } catch (e) {
      toast({ title: "Error", description: "Failed to update item.", variant: "destructive" });
    }
  };

  const getFilteredItems = (category: ItemCategory) => {
    let categoryItems = items.filter(item => item.category === category);
    // For reminders, just sort, no status/priority filter
    if (category === "reminder") {
      categoryItems = sortItems(categoryItems, sortOrder.reminder, category);
      return categoryItems;
    }
    // Apply status filter
    if (filter !== "all") {
      categoryItems = categoryItems.filter(item => 
        (item.category === "task" || item.category === "goal") && item.status === filter
      );
    }
    // Apply priority filter
    if (priorityFilter !== "all") {
      categoryItems = categoryItems.filter(item =>
        (item.category === "task" || item.category === "goal") && item.priority === priorityFilter
      );
    }
    if (tagSearch.trim() !== "") {
      const regex = new RegExp(tagSearch, 'i');
      categoryItems = categoryItems.filter(item =>
        item.tags && item.tags.some(tag => regex.test(tag))
      );
    }
    // Sort
    categoryItems = sortItems(categoryItems, sortOrder[category], category);
    return categoryItems;
  };

  // Sorting logic
  function sortItems(items: TodoItem[], order: string, category: ItemCategory): TodoItem[] {
    let sorted = [...items];
    switch (order) {
      case "newest":
        sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case "oldest":
        sorted.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case "dueSoonest":
        sorted.sort((a, b) => {
          const aDue = (a as any).dueDate ? (a as any).dueDate.getTime() : Infinity;
          const bDue = (b as any).dueDate ? (b as any).dueDate.getTime() : Infinity;
          return aDue - bDue;
        });
        break;
      case "dueLatest":
        sorted.sort((a, b) => {
          const aDue = (a as any).dueDate ? (a as any).dueDate.getTime() : -Infinity;
          const bDue = (b as any).dueDate ? (b as any).dueDate.getTime() : -Infinity;
          return bDue - aDue;
        });
        break;
      case "priorityHigh":
        sorted.sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[(b as any).priority] - priorityOrder[(a as any).priority];
        });
        break;
      case "priorityLow":
        sorted.sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[(a as any).priority] - priorityOrder[(b as any).priority];
        });
        break;
      case "az":
        sorted.sort((a, b) => a.text.localeCompare(b.text));
        break;
      case "za":
        sorted.sort((a, b) => b.text.localeCompare(a.text));
        break;
      default:
        break;
    }
    return sorted;
  }

  const getStatusCounts = (category: ItemCategory) => {
    const categoryItems = items.filter(item => item.category === category);
    
    if (category === "reminder") {
      return { total: categoryItems.length };
    }
    
    const statusItems = categoryItems as (TaskItem | GoalItem)[];
    return {
      completed: statusItems.filter(item => item.status === "completed").length,
      inProgress: statusItems.filter(item => item.status === "in-progress").length,
      onHold: statusItems.filter(item => item.status === "on-hold").length,
      todo: statusItems.filter(item => item.status === "todo").length,
      total: statusItems.length,
    };
  };

  const getStatusColor = (status: TodoStatus) => {
    switch (status) {
      case "completed": return "text-success";
      case "in-progress": return "text-info";
      case "on-hold": return "text-warning";
      default: return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: TodoStatus) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-4 h-4" />;
      case "in-progress": return <Play className="w-4 h-4" />;
      case "on-hold": return <Pause className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: ItemCategory) => {
    switch (category) {
      case "task": return <CheckSquare className="w-4 h-4" />;
      case "goal": return <Target className="w-4 h-4" />;
      case "reminder": return <Gift className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "high": return "text-destructive";
      case "medium": return "text-warning";  
      case "low": return "text-success";
    }
  };

  const getPriorityEmoji = (priority: Priority) => {
    switch (priority) {
      case "high": return "🔴";
      case "medium": return "🟡";
      case "low": return "🟢";
    }
  };

  const handleEditComments = (item: TaskItem | GoalItem & { _id?: string }) => {
    setEditingItem(item);
    setNewComment("");
  };

  const saveComment = async () => {
    if (editingItem && newComment.trim() !== "" && (editingItem as any)._id) {
      await addItemComment((editingItem as any)._id, newComment.trim());
      setNewComment("");
      setEditingItem(null); // Optionally close dialog after save
    }
  };
  const closeCommentDialog = () => {
    setEditingItem(null);
    setNewComment("");
  };

  const renderStats = (category: ItemCategory) => {
    const counts = getStatusCounts(category);
    
    if (category === "reminder") {
      return (
        <div className="flex justify-center gap-4 mb-6 animate-slide-up">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{counts.total}</div>
            <div className="text-sm text-muted-foreground">Total Reminders</div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex justify-center gap-4 mb-6 animate-slide-up">
        <div className="text-center">
          <div className="text-2xl font-bold text-muted-foreground">{counts.todo}</div>
          <div className="text-sm text-muted-foreground">Todo</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-info">{counts.inProgress}</div>
          <div className="text-sm text-muted-foreground">In Progress</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-success">{counts.completed}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-warning">{counts.onHold}</div>
          <div className="text-sm text-muted-foreground">On Hold</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{counts.total}</div>
          <div className="text-sm text-muted-foreground">Total</div>
        </div>
      </div>
    );
  };

  const renderFilterButtons = (category: ItemCategory) => {
    if (category === "reminder") return null;

    return (
      <div className="space-y-4 mb-6 animate-slide-up">
        {/* Status Filters */}
        <div className="flex justify-center gap-2">
          {(["all", "todo", "in-progress", "completed", "on-hold"] as const).map((filterType) => (
            <Button
              key={filterType}
              variant={filter === filterType ? "default" : "outline"}
              onClick={() => setFilter(filterType)}
              className="capitalize"
            >
              {filterType === "in-progress" ? "In Progress" : filterType === "on-hold" ? "On Hold" : filterType}
            </Button>
          ))}
        </div>
        
        {/* Priority Filters */}
        <div className="flex justify-center gap-2">
          <span className="text-sm text-muted-foreground self-center mr-2">Priority:</span>
          {(["all", "high", "medium", "low"] as const).map((priorityType) => (
            <Button
              key={priorityType}
              variant={priorityFilter === priorityType ? "default" : "outline"}
              onClick={() => setPriorityFilter(priorityType)}
              className="capitalize"
              size="sm"
            >
              {priorityType !== "all" && (
                <span className="mr-1">{getPriorityEmoji(priorityType as Priority)}</span>
              )}
              {priorityType}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  const renderItemCard = (item: TodoItem, index: number) => {
    return (
      <Card
        key={item._id}
        className="p-4 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-card)] transition-all duration-300 animate-fade-in"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="space-y-3">
          {/* First line: Main text */}
          <div
            className={`text-lg font-medium transition-all duration-300 ${
              (item.category === "task" || item.category === "goal") && item.status === "completed"
                ? "line-through text-muted-foreground"
                : "text-foreground"
            }`}
          >
            {item.text}
          </div>
          {/* Creation timestamp */}
          <div className="text-xs text-muted-foreground">
            Created: {format(item.createdAt, "MMM d, yyyy HH:mm")}
          </div>

          {/* Second line: Icons and meta info */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              {getCategoryIcon(item.category)}
              <span className="text-xs font-medium text-muted-foreground capitalize">
                {item.category}
              </span>
            </div>
            {(item.category === "task" || item.category === "goal") && (
              <>
                <div className={`flex items-center gap-2 ${getStatusColor(item.status)}`}>
                  {getStatusIcon(item.status)}
                  <span className="text-sm font-medium capitalize">
                    {item.status === "in-progress" ? "In Progress" : item.status === "on-hold" ? "On Hold" : item.status}
                  </span>
                </div>
                <div className={`flex items-center gap-1 ${getPriorityColor(item.priority)}`}>
                  <span className="text-sm">{getPriorityEmoji(item.priority)}</span>
                  <span className="text-xs font-medium capitalize">{item.priority}</span>
                </div>
              </>
            )}
            {item.dueDate && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{format(item.dueDate, "MMM d")}</span>
              </div>
            )}
            {item.category === "reminder" && item.recurrence.isRecurring && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <RotateCcw className="w-3 h-3" />
                <span className="capitalize">{item.recurrence.frequency}</span>
              </div>
            )}
            {item.tags && item.tags.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap">
                {item.tags.map(tag => (
                  <span key={tag} className="text-xs bg-muted px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2 ml-auto">
              {(item.category === "task" || item.category === "goal") && (
                <Dialog open={(editingItem as any)?._id === item._id} onOpenChange={open => { if (!open) closeCommentDialog(); }}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditComments(item)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Comments</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">
                          {item.category === "task" ? "Task" : "Goal"}
                        </Label>
                        <p className="text-sm text-muted-foreground">{item.text}</p>
                      </div>
                      {/* List of comments */}
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {item.comments && item.comments.length > 0 ? (
                          item.comments.map((c, idx) => (
                            <div key={idx} className="bg-muted/50 p-2 rounded-md">
                              <div className="text-xs text-muted-foreground mb-1">
                                {format(c.createdAt, "MMM d, yyyy HH:mm")}
                              </div>
                              <div className="text-sm">{c.text}</div>
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-muted-foreground">No comments yet.</div>
                        )}
                      </div>
                      {/* Add new comment */}
                      <div>
                        <Label htmlFor="comments" className="text-sm font-medium">Add Comment</Label>
                        <Textarea
                          id="comments"
                          placeholder="Add your comment here..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="mt-2"
                          rows={3}
                        />
                      </div>
                      <Button onClick={saveComment} className="w-full" disabled={newComment.trim() === ""}>
                        Add Comment
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => item._id && openEditDialog(item)}
                className="ml-2"
                disabled={!item._id}
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => item._id && deleteItem(item._id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                disabled={!item._id}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Status dropdown and comments remain unchanged */}
          {(item.category === "task" || item.category === "goal") && (
            <div className="flex items-center gap-2">
              <Label className="text-sm text-muted-foreground">Status:</Label>
              <Select
                value={item.status}
                onValueChange={(value: TodoStatus) => item._id && updateItemStatus(item._id, value)}
                disabled={!item._id}
              >
                <SelectTrigger className="w-[140px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">Todo</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {/* Show comments under card for quick view */}
          {(item.category === "task" || item.category === "goal") && item.comments && item.comments.length > 0 && (
            <div className="bg-muted/50 p-3 rounded-md space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Comments:</Label>
              {item.comments.map((c, idx) => (
                <div key={idx} className="border-b last:border-b-0 pb-1 mb-1 last:mb-0 last:pb-0">
                  <div className="text-xs text-muted-foreground mb-1">{format(c.createdAt, "MMM d, yyyy HH:mm")}</div>
                  <div className="text-sm">{c.text}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    );
  };

  const renderCategoryContent = (category: ItemCategory) => {
    const filteredItems = getFilteredItems(category);
    const counts = getStatusCounts(category);

    return (
      <div>
        {/* Sorting dropdown */}
        {renderSortDropdown(category)}
        {/* Add Item Input */}
        <Card className="p-6 mb-6 shadow-[var(--shadow-card)] animate-slide-up">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder={
                  category === "task" 
                    ? "What task needs to be done?" 
                    : category === "goal" 
                    ? "What goal do you want to achieve?"
                    : "What do you want to be reminded about?"
                }
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addItem()}
                className="flex-1 h-12 text-lg"
              />
              <Button 
                onClick={addItem}
                size="lg"
                className="h-12 px-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex gap-4 items-center flex-wrap">
              <div className="flex gap-2 items-center">
                <Label className="text-sm text-muted-foreground">Due date (optional):</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[200px] justify-start text-left font-normal",
                        !newItemDueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newItemDueDate ? format(newItemDueDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newItemDueDate}
                      onSelect={setNewItemDueDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {newItemDueDate && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setNewItemDueDate(undefined)}
                    className="h-8 px-2"
                  >
                    Clear
                  </Button>
                )}
              </div>
              {(category === "task" || category === "goal") && (
                <div className="flex gap-2 items-center">
                  <Label className="text-sm text-muted-foreground">Priority:</Label>
                  <Select value={newItemPriority} onValueChange={(value: Priority) => setNewItemPriority(value)}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">🔴 High</SelectItem>
                      <SelectItem value="medium">🟡 Medium</SelectItem>
                      <SelectItem value="low">🟢 Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {category === "reminder" && (
                <div className="flex gap-4 items-center">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="recurring"
                      checked={isRecurring}
                      onChange={(e) => setIsRecurring(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="recurring" className="text-sm text-muted-foreground">
                      Recurring
                    </Label>
                  </div>
                  {isRecurring && (
                    <Select value={newReminderFrequency} onValueChange={(value: RecurrenceFrequency) => setNewReminderFrequency(value)}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              )}
              <div className="flex gap-2 items-center">
                <Label className="text-sm text-muted-foreground">Tags:</Label>
                <Input
                  placeholder="tag1, tag2"
                  value={newItemTags}
                  onChange={(e) => setNewItemTags(e.target.value)}
                  className="w-[200px]"
                />
              </div>
            </div>
          </div>
        </Card>

        <div className="mb-6">
          <Input
            placeholder="Search by tag"
            value={tagSearch}
            onChange={(e) => setTagSearch(e.target.value)}
            className="max-w-xs"
          />
        </div>

        {renderStats(category)}
        {renderFilterButtons(category)}

        {/* Items List */}
        <div className="space-y-3 animate-slide-up">
          {loading ? (
            <div className="text-center py-8">
              <p>Loading items...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <Card className="p-8 text-center shadow-[var(--shadow-card)]">
              <div className="text-muted-foreground">
                {category === "reminder"
                  ? "No reminders yet. Add one above!"
                  : filter === "all" 
                  ? `No ${category}s yet. Add one above!`
                  : `No ${filter === "in-progress" ? "in progress" : filter === "on-hold" ? "on hold" : filter} ${category}s.`
                }
              </div>
            </Card>
          ) : (
            filteredItems.map((item, index) => renderItemCard(item, index))
          )}
        </div>

        {/* Stats Footer */}
        {filteredItems.length > 0 && category !== "reminder" && (
          <div className="text-center mt-8 text-sm text-muted-foreground animate-fade-in">
            {counts.completed > 0 && (
              <p>🎉 Great job! You've completed {counts.completed} {category}{counts.completed !== 1 ? 's' : ''}.</p>
            )}
            {counts.inProgress > 0 && (
              <p>⚡ You have {counts.inProgress} {category}{counts.inProgress !== 1 ? 's' : ''} in progress.</p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Sorting dropdown component
  const renderSortDropdown = (category: ItemCategory) => {
    let options: { value: string; label: string }[] = [
      { value: "newest", label: "Newest first" },
      { value: "oldest", label: "Oldest first" },
      { value: "az", label: "A-Z" },
      { value: "za", label: "Z-A" },
    ];
    if (category === "task" || category === "goal" || category === "reminder") {
      options.push({ value: "dueSoonest", label: "Due soonest" });
      options.push({ value: "dueLatest", label: "Due latest" });
    }
    if (category === "task" || category === "goal") {
      options.push({ value: "priorityHigh", label: "Priority high-low" });
      options.push({ value: "priorityLow", label: "Priority low-high" });
    }
    return (
      <div className="flex justify-end mb-2">
        <Select value={sortOrder[category]} onValueChange={v => setSortOrder(o => ({ ...o, [category]: v }))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {options.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  // Edit Dialog rendered at root so it works for any item
  const renderEditDialog = () => (
    <Dialog open={!!editDialogOpen} onOpenChange={open => { if (!open) closeEditDialog(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {editForm?.category ? editForm.category.charAt(0).toUpperCase() + editForm.category.slice(1) : ''}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Label>Text</Label>
          <Input value={editForm?.text || ""} onChange={e => handleEditChange("text", e.target.value)} />
          {(editForm?.category === "task" || editForm?.category === "goal") && (
            <>
              <Label>Status</Label>
              <Select value={editForm?.status} onValueChange={v => handleEditChange("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">Todo</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
              <Label>Priority</Label>
              <Select value={editForm?.priority} onValueChange={v => handleEditChange("priority", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}
          <Label>Due Date</Label>
          <Input type="date" value={editForm?.dueDate ? (typeof editForm.dueDate === 'string' ? editForm.dueDate.slice(0,10) : editForm.dueDate.toISOString().slice(0,10)) : ""} onChange={e => handleEditChange("dueDate", e.target.value ? new Date(e.target.value) : undefined)} />
          <Label>Tags</Label>
          <Input
            value={editForm?.tags || ""}
            onChange={e => handleEditChange("tags", e.target.value)}
            placeholder="tag1, tag2"
          />
          {editForm?.category === "reminder" && (
            <>
              <Label>Recurring</Label>
              <input type="checkbox" checked={editForm?.recurrence?.isRecurring || false} onChange={e => handleEditChange("recurrence", { ...editForm.recurrence, isRecurring: e.target.checked })} />
              {editForm?.recurrence?.isRecurring && (
                <Select value={editForm?.recurrence?.frequency} onValueChange={v => handleEditChange("recurrence", { ...editForm.recurrence, frequency: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </>
          )}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={closeEditDialog}>Cancel</Button>
            <Button onClick={saveEdit}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
            Todo App
          </h1>
          <p className="text-muted-foreground">
            Stay organized and get things done
          </p>
        </div>

        {renderEditDialog()}
        <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as ItemCategory)} className="w-full">
          <TabsList className="flex w-full justify-center mb-6 h-12 bg-muted">
            <TabsTrigger value="task" className={`flex items-center gap-2 text-sm font-medium ${activeCategory === 'task' ? 'text-primary' : ''}`}>
              <CheckSquare className="w-4 h-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="reminder" className={`flex items-center gap-2 text-sm font-medium ${activeCategory === 'reminder' ? 'text-primary' : ''}`}>
              <Gift className="w-4 h-4" />
              Reminders
            </TabsTrigger>
            <TabsTrigger value="goal" className={`flex items-center gap-2 text-sm font-medium ${activeCategory === 'goal' ? 'text-primary' : ''}`}>
              <Target className="w-4 h-4" />
              Goals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="task">
            {renderCategoryContent("task")}
          </TabsContent>

          <TabsContent value="reminder">
            {renderCategoryContent("reminder")}
          </TabsContent>

          <TabsContent value="goal">
            {renderCategoryContent("goal")}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}