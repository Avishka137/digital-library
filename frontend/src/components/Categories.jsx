import React, { useState } from 'react';
import { Book, Brain, Church, Lightbulb, History, User, Beaker, Heart, Plus, Edit2, Trash2, Search } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Religious', icon: 'Church', color: 'bg-purple-500', count: 45 },
    { id: 2, name: 'Psychology', icon: 'Brain', color: 'bg-blue-500', count: 32 },
    { id: 3, name: 'Novels', icon: 'Book', color: 'bg-green-500', count: 78 },
    { id: 4, name: 'Science', icon: 'Beaker', color: 'bg-red-500', count: 56 },
    { id: 5, name: 'History', icon: 'History', color: 'bg-yellow-500', count: 41 },
    { id: 6, name: 'Biography', icon: 'User', color: 'bg-indigo-500', count: 29 }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', icon: 'Book', color: 'bg-blue-500' });

  const iconComponents = {
    Church: Church,
    Brain: Brain,
    Book: Book,
    Beaker: Beaker,
    History: History,
    User: User,
    Lightbulb: Lightbulb,
    Heart: Heart
  };

  const colorOptions = [
    'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-red-500',
    'bg-yellow-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'
  ];

  const iconOptions = ['Book', 'Brain', 'Church', 'Beaker', 'History', 'User', 'Lightbulb', 'Heart'];

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      const newCat = {
        id: categories.length + 1,
        name: newCategory.name,
        icon: newCategory.icon,
        color: newCategory.color,
        count: 0
      };
      setCategories([...categories, newCat]);
      setNewCategory({ name: '', icon: 'Book', color: 'bg-blue-500' });
      setIsAddModalOpen(false);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategory({ name: category.name, icon: category.icon, color: category.color });
    setIsAddModalOpen(true);
  };

  const handleUpdateCategory = () => {
    if (editingCategory && newCategory.name.trim()) {
      setCategories(categories.map(cat =>
        cat.id === editingCategory.id
          ? { ...cat, name: newCategory.name, icon: newCategory.icon, color: newCategory.color }
          : cat
      ));
      setEditingCategory(null);
      setNewCategory({ name: '', icon: 'Book', color: 'bg-blue-500' });
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  const renderIcon = (iconName, className = "") => {
    const IconComponent = iconComponents[iconName] || Book;
    return <IconComponent className={className} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-3 rounded-xl shadow-lg">
              <Book className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Categories</h1>
          </div>
          <p className="text-gray-600 text-lg">Manage your book categories here.</p>
        </div>

        {/* Search and Add Button */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <div className="flex-1 min-w-[250px] relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all"
            />
          </div>
          <button
            onClick={() => {
              setEditingCategory(null);
              setNewCategory({ name: '', icon: 'Book', color: 'bg-blue-500' });
              setIsAddModalOpen(true);
            }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Add Category
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${category.color} p-4 rounded-xl shadow-md`}>
                  {renderIcon(category.icon, "w-8 h-8 text-white")}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{category.name}</h3>
              <p className="text-gray-500 text-sm">
                {category.count} {category.count === 1 ? 'book' : 'books'}
              </p>
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Book className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-gray-500 text-lg">No categories found</p>
          </div>
        )}

        {/* Add/Edit Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="Enter category name"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Icon
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {iconOptions.map((icon) => (
                      <button
                        key={icon}
                        onClick={() => setNewCategory({ ...newCategory, icon })}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          newCategory.icon === icon
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {renderIcon(icon, "w-6 h-6 mx-auto text-gray-700")}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Color
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewCategory({ ...newCategory, color })}
                        className={`h-12 rounded-lg ${color} transition-all ${
                          newCategory.color === color
                            ? 'ring-4 ring-offset-2 ring-gray-400'
                            : 'hover:scale-105'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingCategory(null);
                    setNewCategory({ name: '', icon: 'Book', color: 'bg-blue-500' });
                  }}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
                >
                  {editingCategory ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;