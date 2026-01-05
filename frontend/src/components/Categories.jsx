import React, { useState } from 'react';
import { Book, Brain, Church, Lightbulb, History, User, Beaker, Heart, Plus, Edit2, Trash2, Search, X } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Religious', icon: 'Church', color: 'from-purple-500 to-purple-600', count: 45 },
    { id: 2, name: 'Psychology', icon: 'Brain', color: 'from-blue-500 to-blue-600', count: 32 },
    { id: 3, name: 'Novels', icon: 'Book', color: 'from-green-500 to-green-600', count: 78 },
    { id: 4, name: 'Science', icon: 'Beaker', color: 'from-red-500 to-red-600', count: 56 },
    { id: 5, name: 'History', icon: 'History', color: 'from-yellow-500 to-yellow-600', count: 41 },
    { id: 6, name: 'Biography', icon: 'User', color: 'from-indigo-500 to-indigo-600', count: 29 }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', icon: 'Book', color: 'from-blue-500 to-blue-600' });

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
    { name: 'Blue', value: 'from-blue-500 to-blue-600' },
    { name: 'Purple', value: 'from-purple-500 to-purple-600' },
    { name: 'Green', value: 'from-green-500 to-green-600' },
    { name: 'Red', value: 'from-red-500 to-red-600' },
    { name: 'Yellow', value: 'from-yellow-500 to-yellow-600' },
    { name: 'Indigo', value: 'from-indigo-500 to-indigo-600' },
    { name: 'Pink', value: 'from-pink-500 to-pink-600' },
    { name: 'Teal', value: 'from-teal-500 to-teal-600' }
  ];

  const iconOptions = ['Book', 'Brain', 'Church', 'Beaker', 'History', 'User', 'Lightbulb', 'Heart'];

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      const newCat = {
        id: Math.max(...categories.map(c => c.id), 0) + 1,
        name: newCategory.name,
        icon: newCategory.icon,
        color: newCategory.color,
        count: 0
      };
      setCategories([...categories, newCat]);
      resetForm();
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
      resetForm();
    }
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  const resetForm = () => {
    setIsAddModalOpen(false);
    setEditingCategory(null);
    setNewCategory({ name: '', icon: 'Book', color: 'from-blue-500 to-blue-600' });
  };

  const renderIcon = (iconName, className = "") => {
    const IconComponent = iconComponents[iconName] || Book;
    return <IconComponent className={className} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform">
              <Book className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent">
                Categories
              </h1>
              <p className="text-gray-500 text-sm mt-1">Organize your digital library</p>
            </div>
          </div>
        </div>

        {/* Search and Add Button */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <div className="flex-1 min-w-[280px] relative group">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-5 py-4 rounded-2xl bg-white border-2 border-gray-100 focus:border-blue-500 focus:outline-none transition-all shadow-sm hover:shadow-md focus:shadow-xl"
            />
          </div>
          <button
            onClick={() => {
              setEditingCategory(null);
              setNewCategory({ name: '', icon: 'Book', color: 'from-blue-500 to-blue-600' });
              setIsAddModalOpen(true);
            }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-3 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-2xl hover:scale-105 transform"
          >
            <Plus className="w-6 h-6" />
            Add Category
          </button>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category, index) => (
              <div
                key={category.id}
                style={{ animationDelay: `${index * 0.1}s` }}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2 opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className={`bg-gradient-to-br ${category.color} p-5 rounded-2xl shadow-xl group-hover:shadow-2xl transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-300`}>
                    {renderIcon(category.icon, "w-8 h-8 text-white")}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="p-2.5 hover:bg-blue-50 rounded-xl transition-all hover:scale-110 active:scale-95"
                      title="Edit category"
                    >
                      <Edit2 className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-2.5 hover:bg-red-50 rounded-xl transition-all hover:scale-110 active:scale-95"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${category.color}`}></div>
                  <p className="text-gray-500 text-sm font-medium">
                    {category.count} {category.count === 1 ? 'book' : 'books'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 animate-[fadeInScale_0.8s_ease-out]">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Book className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No categories found</h3>
            <p className="text-gray-500">Try adjusting your search or create a new category</p>
          </div>
        )}

        {/* Add/Edit Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 animate-[slideUp_0.4s_cubic-bezier(0.4,0,0.2,1)]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800">
                  {editingCategory ? 'Edit Category' : 'Create Category'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="e.g., Science Fiction"
                    className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all text-lg"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Choose Icon
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {iconOptions.map((icon) => (
                      <button
                        key={icon}
                        onClick={() => setNewCategory({ ...newCategory, icon })}
                        className={`p-4 rounded-2xl border-2 transition-all hover:scale-105 active:scale-95 ${
                          newCategory.icon === icon
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {renderIcon(icon, "w-7 h-7 mx-auto text-gray-700")}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Pick Color
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {colorOptions.map((colorObj) => (
                      <button
                        key={colorObj.value}
                        onClick={() => setNewCategory({ ...newCategory, color: colorObj.value })}
                        className={`h-14 rounded-2xl bg-gradient-to-br ${colorObj.value} transition-all hover:scale-105 active:scale-95 ${
                          newCategory.color === colorObj.value
                            ? 'ring-4 ring-offset-2 ring-blue-400 shadow-lg'
                            : 'hover:shadow-md'
                        }`}
                        title={colorObj.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={resetForm}
                  className="flex-1 px-6 py-4 rounded-2xl border-2 border-gray-200 font-bold text-gray-700 hover:bg-gray-50 transition-all hover:scale-105 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
                  disabled={!newCategory.name.trim()}
                  className="flex-1 px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                >
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default Categories;