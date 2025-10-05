"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export default function DebugPage() {
  const { user } = useAuth();
  const [allClothes, setAllClothes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Fetch ALL clothes from database (bypass filters)
        const response = await fetch('/api/debug-clothes');
        if (response.ok) {
          const data = await response.json();
          setAllClothes(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAll();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🔍 Database Debug View</h1>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="font-bold mb-2">Current User:</h2>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      <div className="mb-4 p-4 bg-gray-100 rounded">
        <h2 className="font-bold">Total Items in Database: {allClothes.length}</h2>
      </div>

      <div className="grid gap-4">
        {allClothes.map((cloth, idx) => (
          <div 
            key={cloth._id} 
            className="p-4 border rounded-lg"
            style={{ 
              backgroundColor: cloth.user ? '#e6f7ff' : '#fff7e6'
            }}
          >
            <div className="font-bold mb-2">
              #{idx + 1} - {cloth.name} 
              {cloth.user ? ' 👤 USER LISTING' : ' 🏪 SHOP ITEM'}
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><strong>ID:</strong> {cloth._id}</div>
              <div><strong>User:</strong> {cloth.user || 'null (shop item)'}</div>
              <div><strong>User Name:</strong> {cloth.userName || 'N/A'}</div>
              <div><strong>Status:</strong> {cloth.status || 'null (shop)'}</div>
              <div><strong>Price:</strong> ${cloth.price}</div>
              <div><strong>Category:</strong> {cloth.category}</div>
              <div><strong>Condition:</strong> {cloth.condition || 'N/A'}</div>
              <div><strong>Views:</strong> {cloth.views || 0}</div>
              <div className="col-span-2"><strong>Created:</strong> {new Date(cloth.createdAt).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
