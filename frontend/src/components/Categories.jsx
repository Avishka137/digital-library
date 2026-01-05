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
              <h1 className="text-5xl font-bold gradient-text">
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
              className="search-input w-full pl-14 pr-5 py-4 rounded-2xl bg-white border-2 border-gray-100 focus:border-blue-500 focus:outline-none transition-all shadow-sm hover:shadow-md"
            />
          </div>
          <button
            onClick={() => {
              setEditingCategory(null);
              setNewCategory({ name: '', icon: 'Book', color: 'from-blue-500 to-blue-600' });
              setIsAddModalOpen(true);
            }}
            className="add-category-btn bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-3 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
          >
            <Plus className="w-6 h-6" />
            Add Category
          </button>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="category-card group bg-white rounded-3xl shadow-lg hover:shadow-2xl p-6 border border-gray-100 hover:border-blue-200 relative"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className={`category-icon-container bg-gradient-to-br ${category.color} p-5 rounded-2xl shadow-xl`}>
                    {renderIcon(category.icon, "w-8 h-8 text-white")}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="edit-btn p-2.5 hover:bg-blue-50 rounded-xl transition-all"
                      title="Edit category"
                    >
                      <Edit2 className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="delete-btn p-2.5 hover:bg-red-50 rounded-xl transition-all"
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
          <div className="empty-state text-center py-24">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Book className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No categories found</h3>
            <p className="text-gray-500">Try adjusting your search or create a new category</p>
          </div>
        )}

        {/* Add/Edit Modal */}
        {isAddModalOpen && (
          <div className="modal-overlay fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="modal-content bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8">
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
                        className={`icon-selector p-4 rounded-2xl border-2 transition-all ${
                          newCategory.icon === icon
                            ? 'selected border-blue-500 bg-blue-50 shadow-md'
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
                        className={`color-option h-14 rounded-2xl bg-gradient-to-br ${colorObj.value} transition-all ${
                          newCategory.color === colorObj.value
                            ? 'selected ring-4 ring-offset-2 ring-blue-400 shadow-lg'
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
        /* Import your categories.css styles */
        
        /* Smooth animations for category cards */
        .category-card {
          animation: fadeInUp 0.5s ease-out;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .category-card:hover {
          transform: translateY(-8px) scale(1.02);
        }

        /* Fade in animation */
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

        /* Stagger animation for multiple cards */
        .category-card:nth-child(1) { animation-delay: 0.1s; }
        .category-card:nth-child(2) { animation-delay: 0.2s; }
        .category-card:nth-child(3) { animation-delay: 0.3s; }
        .category-card:nth-child(4) { animation-delay: 0.4s; }
        .category-card:nth-child(5) { animation-delay: 0.5s; }
        .category-card:nth-child(6) { animation-delay: 0.6s; }
        .category-card:nth-child(7) { animation-delay: 0.7s; }
        .category-card:nth-child(8) { animation-delay: 0.8s; }

        /* Icon container hover effect */
        .category-icon-container {
          transition: all 0.3s ease;
        }

        .category-card:hover .category-icon-container {
          transform: rotate(10deg) scale(1.1);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
        }

        /* Search bar focus animation */
        .search-input {
          transition: all 0.3s ease;
        }

        .search-input:focus {
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.2);
        }

        /* Button hover effects */
        .add-category-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .add-category-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(37, 99, 235, 0.4);
        }

        .add-category-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .add-category-btn:hover::before {
          width: 300px;
          height: 300px;
        }

        /* Modal animations */
        .modal-overlay {
          animation: fadeIn 0.3s ease-out;
        }

        .modal-content {
          animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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

        /* Icon selection buttons */
        .icon-selector {
          transition: all 0.2s ease;
        }

        .icon-selector:hover {
          transform: scale(1.1);
        }

        .icon-selector.selected {
          animation: pulse 0.5s ease;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }

        /* Color picker hover */
        .color-option {
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .color-option:hover:not(.selected) {
          transform: scale(1.1);
          opacity: 0.8;
        }

        .color-option.selected {
          animation: colorPulse 0.6s ease;
        }

        @keyframes colorPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        /* Delete button animation */
        .delete-btn {
          transition: all 0.2s ease;
        }

        .delete-btn:hover {
          transform: scale(1.2);
        }

        /* Edit button animation */
        .edit-btn {
          transition: all 0.2s ease;
        }

        .edit-btn:hover {
          transform: scale(1.2);
        }

        /* Empty state animation */
        .empty-state {
          animation: fadeInScale 0.8s ease-out;
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

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .category-card {
            animation-delay: 0s !important;
          }
          
          .category-card:hover {
            transform: translateY(-4px) scale(1.01);
          }
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #3b82f6, #2563eb);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #2563eb, #1d4ed8);
        }

        /* Gradient text effect for headers */
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Card shadow on hover */
        .category-card::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 1.5rem;
          background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.1));
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .category-card:hover::after {
          opacity: 1;
        }

        /* Focus visible for accessibility */
        *:focus-visible {
          outline: 3px solid #3b82f6;
          outline-offset: 2px;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default Categories;