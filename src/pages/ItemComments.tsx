import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";

interface Comment {
  text: string;
  createdAt?: string;
}

interface Item {
  _id?: string;
  text: string;
  comments?: Comment[];
}

const ItemComments = () => {
  const { id } = useParams();
  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      const res = await fetch(`/api/items/${id}`);
      const data = await res.json();
      setItem(data);
    };
    fetchItem();
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <Navigation />
      <div className="p-4 max-w-2xl mx-auto space-y-4">
        <Link to="/" className="text-sm underline text-muted-foreground">
          &larr; Back
        </Link>
        <h1 className="text-2xl font-bold">Comments</h1>
        <ul className="space-y-2">
          {item?.comments && item.comments.length > 0 ? (
            item.comments.map((c, idx) => (
              <li key={idx} className="p-2 bg-card rounded shadow">
                <div className="text-sm">{c.text}</div>
              </li>
            ))
          ) : (
            <li className="text-sm text-muted-foreground">No comments</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ItemComments;
