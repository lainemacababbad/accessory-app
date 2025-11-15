import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Heart, Eye, X } from 'lucide-react';

const AccessoryApp = () => {
  const [view, setView] = useState('collection');
  const [accessories, setAccessories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [schedule, setSchedule] = useState({});
  const [filterCategory, setFilterCategory] = useState('all');
  
  const categories = ['Necklace', 'Earrings', 'Bracelet', 'Ring', 'Watch', 'Glasses', 'Hair Accessory', 'Other'];
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = () => {
    const accessoriesData = localStorage.getItem('accessories');
    const scheduleData = localStorage.getItem('schedule');
    if (accessoriesData) setAccessories(JSON.parse(accessoriesData));
    if (scheduleData) setSchedule(JSON.parse(scheduleData));
  };
  
  const saveData = (newAccessories = accessories, newSchedule = schedule) => {
    localStorage.setItem('accessories', JSON.stringify(newAccessories));
    localStorage.setItem('schedule', JSON.stringify(newSchedule));
  };
  
  const AddAccessoryModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      category: 'Necklace',
      image: '',
      favorite: false,
      occasions: [],
      notes: ''
    });
    
    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData({...formData, image: reader.result});
        };
        reader.readAsDataURL(file);
      }
    };
    
    const handleSubmit = () => {
      if (formData.name && formData.image) {
        const newAccessory = {
          ...formData,
          id: Date.now(),
          dateAdded: new Date().toISOString(),
          lastWorn: null
        };
        const updated = [...accessories, newAccessory];
        setAccessories(updated);
        saveData(updated);
        setShowAddModal(false);
      }
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Add Accessory</h2>
            <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Pearl necklace"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              {formData.image && (
                <img src={formData.image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg" />
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                rows="2"
                placeholder="Where you bought it, what it goes with..."
              />
            </div>
            
            <button
              onClick={handleSubmit}
              className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition"
            >
              Add to Collection
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  const toggleFavorite = (id) => {
    const updated = accessories.map(acc => 
      acc.id === id ? {...acc, favorite: !acc.favorite} : acc
    );
    setAccessories(updated);
    saveData(updated);
  };
  
  const deleteAccessory = (id) => {
    if (confirm('Remove this accessory from your collection?')) {
      const updated = accessories.filter(acc => acc.id !== id);
      setAccessories(updated);
      saveData(updated);
    }
  };
  
  const scheduleAccessory = (date, accessoryId) => {
    const updated = {...schedule};
    if (!updated[date]) updated[date] = [];
    if (updated[date].includes(accessoryId)) {
      updated[date] = updated[date].filter(id => id !== accessoryId);
    } else {
      updated[date].push(accessoryId);
    }
    setSchedule(updated);
    saveData(accessories, updated);
    
    const accessoryUpdated = accessories.map(acc =>
      acc.id === accessoryId ? {...acc, lastWorn: date} : acc
    );
    setAccessories(accessoryUpdated);
    saveData(accessoryUpdated, updated);
  };
  
  const CollectionView = () => {
    const filtered = filterCategory === 'all' 
      ? accessories 
      : accessories.filter(acc => acc.category === filterCategory);
    
    return (
      <div>
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${filterCategory === 'all' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${filterCategory === cat ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No accessories yet. Start building your collection!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(acc => (
              <div key={acc.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="relative">
                  <img src={acc.image} alt={acc.name} className="w-full h-48 object-cover" />
                  <button
                    onClick={() => toggleFavorite(acc.id)}
                    className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md"
                  >
                    <Heart size={20} className={acc.favorite ? 'fill-pink-500 text-pink-500' : 'text-gray-400'} />
                  </button>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 truncate">{acc.name}</h3>
                  <p className="text-sm text-gray-500">{acc.category}</p>
                  {acc.lastWorn && (
                    <p className="text-xs text-gray-400 mt-1">Last worn: {new Date(acc.lastWorn).toLocaleDateString()}</p>
                  )}
                  <button
                    onClick={() => deleteAccessory(acc.id)}
                    className="mt-2 text-red-500 text-sm hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  const CalendarView = () => {
    const scheduledAccessories = schedule[selectedDate] || [];
    const scheduledItems = scheduledAccessories.map(id => 
      accessories.find(acc => acc.id === id)
    ).filter(Boolean);
    
    return (
      <div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
          />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Accessories for {new Date(selectedDate + 'T00:00:00').toLocaleDateString()}
        </h3>
        
        {scheduledItems.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {scheduledItems.map(acc => (
              <div key={acc.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img src={acc.image} alt={acc.name} className="w-full h-32 object-cover" />
                <div className="p-2">
                  <p className="font-medium text-sm truncate">{acc.name}</p>
                  <button
                    onClick={() => scheduleAccessory(selectedDate, acc.id)}
                    className="text-xs text-red-500 mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <h4 className="text-md font-semibold text-gray-800 mb-3">Add Accessories</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {accessories.map(acc => {
            const isScheduled = scheduledAccessories.includes(acc.id);
            return (
              <div
                key={acc.id}
                onClick={() => scheduleAccessory(selectedDate, acc.id)}
                className={`cursor-pointer bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition ${isScheduled ? 'ring-2 ring-pink-500' : ''}`}
              >
                <img src={acc.image} alt={acc.name} className="w-full h-32 object-cover" />
                <div className="p-2">
                  <p className="font-medium text-sm truncate">{acc.name}</p>
                  <p className="text-xs text-gray-500">{acc.category}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  const TodayView = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayAccessories = schedule[today] || [];
    const todayItems = todayAccessories.map(id => 
      accessories.find(acc => acc.id === id)
    ).filter(Boolean);
    
    const unwornRecently = accessories
      .filter(acc => !acc.lastWorn || new Date(acc.lastWorn) < new Date(Date.now() - 14 * 24 * 60 * 60 * 1000))
      .slice(0, 4);
    
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Today's Accessories</h2>
        
        {todayItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {todayItems.map(acc => (
              <div key={acc.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img src={acc.image} alt={acc.name} className="w-full h-48 object-cover" />
                <div className="p-3">
                  <h3 className="font-semibold text-gray-800">{acc.name}</h3>
                  <p className="text-sm text-gray-500">{acc.category}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-pink-50 rounded-lg p-6 mb-8">
            <p className="text-gray-700">No accessories scheduled for today. Check out suggestions below!</p>
          </div>
        )}
        
        {unwornRecently.length > 0 && (
          <>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Time to Wear Again</h3>
            <p className="text-gray-600 mb-4">These beauties haven't been worn in a while:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {unwornRecently.map(acc => (
                <div key={acc.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img src={acc.image} alt={acc.name} className="w-full h-48 object-cover" />
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-800">{acc.name}</h3>
                    <p className="text-sm text-gray-500">{acc.category}</p>
                    <button
                      onClick={() => {
                        setSelectedDate(today);
                        scheduleAccessory(today, acc.id);
                      }}
                      className="mt-2 text-sm text-pink-500 hover:text-pink-700"
                    >
                      Wear today
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };
  
  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
    {/* Phone frame */}
    <div className="w-full sm:max-w-sm sm:h-[90vh] bg-white sm:rounded-3xl sm:shadow-2xl sm:border sm:border-pink-100 overflow-hidden flex flex-col">
      {/* Scrollable content inside phone */}
      <div className="flex-1 overflow-y-auto p-4">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">My Accessory Collection</h1>
          <p className="text-sm text-gray-600">Organize, plan, and rediscover your accessories</p>
        </header>

        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          <button
            onClick={() => setView('today')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${view === 'today' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-pink-50'}`}
          >
            <Eye size={16} />
            Today
          </button>
          <button
            onClick={() => setView('collection')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${view === 'collection' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-pink-50'}`}
          >
            <Heart size={16} />
            Collection
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${view === 'calendar' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-pink-50'}`}
          >
            <Calendar size={16} />
            Calendar
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="ml-auto flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium bg-purple-500 text-white hover:bg-purple-600 transition"
          >
            <Plus size={16} />
            Add
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-4">
          {view === 'collection' && <CollectionView />}
          {view === 'calendar' && <CalendarView />}
          {view === 'today' && <TodayView />}
        </div>
      </div>

      {showAddModal && <AddAccessoryModal />}
    </div>
  </div>
);
};

export default AccessoryApp;
