import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-background">
      {/* Add your navigation/layout here */}
      <nav className="border-b p-4">
        <h1 className="text-2xl font-bold">iMotion Back Office</h1>
      </nav>
      
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
