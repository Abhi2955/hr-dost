import { useState, useEffect } from "react";

const ORG_ID = "org1";

interface FlowNode {
  id: string;
  title: string;
  type: string;
  children?: FlowNode[];
  content?: string;
  buttons?: { label: string; action: string; target?: string }[];
  static?: any;
}

function renderNode(node: FlowNode, depth = 0, onEdit?: (node: FlowNode, parent?: FlowNode) => void, parent?: FlowNode) {
  return (
    <div key={node.id} style={{ marginLeft: depth * 24, borderLeft: depth ? '2px solid #eee' : undefined, paddingLeft: 8 }}>
      <div className="flex items-center gap-2 mb-1">
        <span className="font-bold">{node.title}</span>
        <span className="text-xs text-muted-foreground">[{node.type}]</span>
        <button className="text-xs text-blue-600 underline" onClick={() => onEdit && onEdit(node, parent)}>Edit</button>
      </div>
      {node.content && <div className="text-sm text-muted-foreground mb-1">{node.content}</div>}
      {node.buttons && (
        <div className="flex gap-2 mb-1">
          {node.buttons.map((btn, i) => (
            <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">{btn.label}</span>
          ))}
        </div>
      )}
      {node.static && (
        <div className="text-xs text-gray-500 mb-1">Static: {JSON.stringify(node.static)}</div>
      )}
      {node.children && node.children.map(child => renderNode(child, depth + 1, onEdit, node))}
    </div>
  );
}

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export default function OnboardingFlowEditor() {
  const [flow, setFlow] = useState<FlowNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingNode, setEditingNode] = useState<{ node: FlowNode; parent?: FlowNode } | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [showAddChild, setShowAddChild] = useState(false);
  const [showAddSibling, setShowAddSibling] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch flow from backend
  useEffect(() => {
    setLoading(true);
    fetch(`/api/orgs/${ORG_ID}/onboarding-flow`)
      .then(r => r.json())
      .then(data => { setFlow(data); setLoading(false); })
      .catch(e => { setError("Failed to load flow"); setLoading(false); });
  }, []);

  // Helper to update a node in the tree
  function updateNode(tree: FlowNode, nodeId: string, updater: (node: FlowNode, parent?: FlowNode) => void, parent?: FlowNode): boolean {
    if (tree.id === nodeId) {
      updater(tree, parent);
      return true;
    }
    if (tree.children) {
      for (let child of tree.children) {
        if (updateNode(child, nodeId, updater, tree)) return true;
      }
    }
    return false;
  }

  // Helper to remove a node from the tree
  function removeNode(tree: FlowNode, nodeId: string): boolean {
    if (!tree.children) return false;
    const idx = tree.children.findIndex(child => child.id === nodeId);
    if (idx !== -1) {
      tree.children.splice(idx, 1);
      return true;
    }
    for (let child of tree.children) {
      if (removeNode(child, nodeId)) return true;
    }
    return false;
  }

  // Edit node handler
  function handleEdit(node: FlowNode, parent?: FlowNode) {
    setEditingNode({ node, parent });
    setEditForm({ ...node });
    setShowAddChild(false);
    setShowAddSibling(false);
  }

  // Save node edits
  function handleSaveEdit() {
    if (!flow) return;
    const updated = deepClone(flow);
    updateNode(updated, editForm.id, (node) => {
      Object.assign(node, editForm);
    });
    setFlow(updated);
    setEditingNode(null);
    setEditForm(null);
  }

  // Remove node
  function handleRemoveNode() {
    if (!editingNode || !flow) return;
    const updated = deepClone(flow);
    removeNode(updated, editingNode.node.id);
    setFlow(updated);
    setEditingNode(null);
    setEditForm(null);
  }

  // Add child node
  function handleAddChild(type: string) {
    if (!editingNode || !flow) return;
    const newNode: FlowNode = {
      id: `${editingNode.node.id}-child-${Date.now()}`,
      title: "New Node",
      type,
      content: type === "card" ? "" : undefined,
      children: type === "flow" ? [] : undefined
    };
    const updated = deepClone(flow);
    updateNode(updated, editingNode.node.id, (node) => {
      if (!node.children) node.children = [];
      node.children.push(newNode);
    });
    setFlow(updated);
    setEditingNode(null);
    setEditForm(null);
    setShowAddChild(false);
  }

  // Add sibling node
  function handleAddSibling(type: string) {
    if (!editingNode || !editingNode.parent || !flow) return;
    const newNode: FlowNode = {
      id: `${editingNode.parent.id}-child-${Date.now()}`,
      title: "New Node",
      type,
      content: type === "card" ? "" : undefined,
      children: type === "flow" ? [] : undefined
    };
    const updated = deepClone(flow);
    updateNode(updated, editingNode.parent.id, (node) => {
      if (!node.children) node.children = [];
      node.children.push(newNode);
    });
    setFlow(updated);
    setEditingNode(null);
    setEditForm(null);
    setShowAddSibling(false);
  }

  // Save to backend
  function handleSaveToBackend() {
    if (!flow) return;
    setSaving(true);
    fetch(`/api/orgs/${ORG_ID}/onboarding-flow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(flow)
    })
      .then(r => r.json())
      .then(() => { setSaving(false); alert("Flow saved to backend!"); })
      .catch(() => { setSaving(false); alert("Failed to save flow"); });
  }

  if (loading) return <div className="p-6">Loading flow...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!flow) return <div className="p-6">No flow loaded.</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Onboarding Flow Editor</h2>
      <div className="mb-6">
        {renderNode(flow, 0, handleEdit)}
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4" onClick={handleSaveToBackend} disabled={saving}>{saving ? "Saving..." : "Save Flow to Backend"}</button>
      {editingNode && editForm && (
        <div className="p-4 border rounded bg-gray-50 mb-4">
          <h3 className="font-semibold mb-2">Edit Node: {editingNode.node.title}</h3>
          <div className="mb-2">
            <label className="block text-xs mb-1">Title</label>
            <input className="border px-2 py-1 rounded w-full" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
          </div>
          <div className="mb-2">
            <label className="block text-xs mb-1">Type</label>
            <select className="border px-2 py-1 rounded w-full" value={editForm.type} onChange={e => setEditForm({ ...editForm, type: e.target.value })}>
              <option value="flow">flow</option>
              <option value="card">card</option>
            </select>
          </div>
          {editForm.type === "card" && (
            <div className="mb-2">
              <label className="block text-xs mb-1">Content</label>
              <textarea className="border px-2 py-1 rounded w-full" value={editForm.content || ""} onChange={e => setEditForm({ ...editForm, content: e.target.value })} />
            </div>
          )}
          <div className="mb-2">
            <label className="block text-xs mb-1">Buttons (JSON)</label>
            <textarea className="border px-2 py-1 rounded w-full" value={editForm.buttons ? JSON.stringify(editForm.buttons, null, 2) : ""} onChange={e => {
              try {
                setEditForm({ ...editForm, buttons: JSON.parse(e.target.value) });
              } catch {
                setEditForm({ ...editForm, buttons: e.target.value });
              }
            }} />
          </div>
          <div className="flex gap-2 mt-2">
            <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={handleSaveEdit}>Save</button>
            <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={handleRemoveNode}>Delete</button>
            <button className="bg-gray-400 text-white px-3 py-1 rounded" onClick={() => setEditingNode(null)}>Cancel</button>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => setShowAddChild(!showAddChild)}>Add Child</button>
            <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => setShowAddSibling(!showAddSibling)} disabled={!editingNode.parent}>Add Sibling</button>
          </div>
          {showAddChild && (
            <div className="mt-2 flex gap-2">
              <button className="bg-purple-600 text-white px-2 py-1 rounded" onClick={() => handleAddChild("flow")}>Add Flow</button>
              <button className="bg-purple-600 text-white px-2 py-1 rounded" onClick={() => handleAddChild("card")}>Add Card</button>
            </div>
          )}
          {showAddSibling && (
            <div className="mt-2 flex gap-2">
              <button className="bg-purple-600 text-white px-2 py-1 rounded" onClick={() => handleAddSibling("flow")}>Add Flow</button>
              <button className="bg-purple-600 text-white px-2 py-1 rounded" onClick={() => handleAddSibling("card")}>Add Card</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 