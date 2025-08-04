const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: String,
  createdAt: { type: Date, default: Date.now },
});

const itemSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  text: String,
  category: String, // 'task', 'goal', 'reminder'
  status: String,   // for task/goal
  priority: String, // for task/goal
  dueDate: Date,
  comments: [commentSchema], // for task/goal
  recurrence: {
    frequency: String,
    isRecurring: Boolean,
  }, // for reminder
  createdAt: { type: Date, default: Date.now },
});

const TodoItem = mongoose.models.TodoItem || mongoose.model('TodoItem', itemSchema);

async function getItems(userId) {
  return TodoItem.find({ userId }).sort({ createdAt: -1 });
}

async function createItem(data) {
  const item = new TodoItem(data);
  await item.save();
  return item;
}

async function updateItem(id, update) {
  return TodoItem.findByIdAndUpdate(id, update, { new: true });
}

async function deleteItem(id) {
  return TodoItem.findByIdAndDelete(id);
}

async function addComment(id, comment) {
  const item = await TodoItem.findById(id);
  if (!item) throw new Error('Item not found');
  item.comments.push(comment);
  await item.save();
  return item;
}

module.exports = {
  getItems,
  createItem,
  updateItem,
  deleteItem,
  addComment,
  TodoItem,
}; 