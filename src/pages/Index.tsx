import Navigation from "@/components/Navigation";
import TodoApp from "@/components/TodoApp";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <Navigation />
      <TodoApp />
    </div>
  );
};

export default Index;
