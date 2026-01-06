import React, { useState } from 'react';
import { Book, Brain, Church, Lightbulb, History, User, Beaker, Heart, Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Religious', icon: 'Church', color: 'purple', count: 45 },
    { id: 2, name: 'Psychology', icon: 'Brain', color: 'blue', count: 32 },
    { id: 3, name: 'Novels', icon: 'Book', color: 'green', count: 78 },
    { id: 4, name: 'Science', icon: 'Beaker', color: 'red', count: 56 },
    { id: 5, name: 'History', icon: 'History', color: 'yellow', count: 41 },
    { id: 6, name: 'Biography', icon: 'User', color: 'indigo', count: 29 }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', icon: 'Book', color: 'blue' });

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
    { name: 'Blue', value: 'blue' },
    { name: 'Purple', value: 'purple' },
    { name: 'Green', value: 'green' },
    { name: 'Red', value: 'red' },
    { name: 'Yellow', value: 'yellow' },
    { name: 'Indigo', value: 'indigo' },
    { name: 'Pink', value: 'pink' },
    { name: 'Teal', value: 'teal' }
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
    setNewCategory({ name: '', icon: 'Book', color: 'blue' });
  };

  const renderIcon = (iconName, className = "") => {
    const IconComponent = iconComponents[iconName] || Book;
    return <IconComponent className={className} />;
  };

  return (
    <div className="categories-page">
      <div className="categories-container">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <div className="header-icon">
              <Book className="icon" />
            </div>
            <div className="header-text">
              <h1 className="gradient-text">Categories</h1>
              <p className="subtitle">Organize your digital library</p>
            </div>
          </div>
        </div>

        {/* Search and Add Button */}
        <div className="controls-section">
          <div className="search-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button
            onClick={() => {
              setEditingCategory(null);
              setNewCategory({ name: '', icon: 'Book', color: 'blue' });
              setIsAddModalOpen(true);
            }}
            className="add-category-btn"
          >
            <Plus className="btn-icon" />
            Add Category
          </button>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length > 0 ? (
          <div className="categories-grid">
            {filteredCategories.map((category) => (
              <div key={category.id} className="category-card">
                <div className="card-header">
                  <div className={`category-icon-container color-${category.color}`}>
                    {renderIcon(category.icon, "category-icon")}
                  </div>
                  <div className="card-actions">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="edit-btn"
                      title="Edit category"
                    >
                      <Edit2 className="action-icon" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="delete-btn"
                      title="Delete category"
                    >
                      <Trash2 className="action-icon" />
                    </button>
                  </div>
                </div>
                <h3 className="category-name">{category.name}</h3>
                <div className="category-info">
                  <div className={`color-dot color-${category.color}`}></div>
                  <p className="book-count">
                    {category.count} {category.count === 1 ? 'book' : 'books'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <Book className="icon" />
            </div>
            <h3 className="empty-title">No categories found</h3>
            <p className="empty-text">Try adjusting your search or create a new category</p>
          </div>
        )}

        {/* Add/Edit Modal */}
        {isAddModalOpen && (
          <div className="modal-overlay" onClick={resetForm}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  {editingCategory ? 'Edit Category' : 'Create Category'}
                </h2>
                <button onClick={resetForm} className="close-btn">
                  <X className="close-icon" />
                </button>
              </div>
              
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Category Name</label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="e.g., Science Fiction"
                    className="form-input"
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Choose Icon</label>
                  <div className="icon-grid">
                    {iconOptions.map((icon) => (
                      <button
                        key={icon}
                        onClick={() => setNewCategory({ ...newCategory, icon })}
                        className={`icon-selector ${newCategory.icon === icon ? 'selected' : ''}`}
                      >
                        {renderIcon(icon, "selector-icon")}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Pick Color</label>
                  <div className="color-grid">
                    {colorOptions.map((colorObj) => (
                      <button
                        key={colorObj.value}
                        onClick={() => setNewCategory({ ...newCategory, color: colorObj.value })}
                        className={`color-option color-${colorObj.value} ${
                          newCategory.color === colorObj.value ? 'selected' : ''
                        }`}
                        title={colorObj.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button onClick={resetForm} className="cancel-btn">
                  Cancel
                </button>
                <button
                  onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
                  disabled={!newCategory.name.trim()}
                  className="submit-btn"
                >
                  {editingCategory ? 'Update' : 'Create'}
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