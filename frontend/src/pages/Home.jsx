import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import BookCard from '../components/BookCard';
import AddBookModal from '../components/AddBookModal';
import { BookOpen, Plus } from 'lucide-react';

function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const categories = [
    'All',
    'Literary Fiction',
    'Historical Fiction',
    'Science Fiction (Sci-Fi)',
    'Romance',
    'Crime / Detective',
    'Politics',
    'Philosophy',
    'Psychology'
  ];

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const result = await window.storage.get('library-books');
      if (result && result.value) {
        setBooks(JSON.parse(result.value));
      }
    } catch (error) {
      console.log('No saved books found');
    }
  };

  const saveBooks = async (updatedBooks) => {
    try {
      await window.storage.set('library-books', JSON.stringify(updatedBooks));
    } catch (error) {
      console.error('Failed to save books:', error);
    }
  };

  const handleAddBook = async (newBook) => {
    const bookToAdd = {
      id: Date.now().toString(),
      ...newBook,
      coverUrl: newBook.coverUrl || `https://via.placeholder.com/200x300/6366f1/ffffff?text=${encodeURIComponent(newBook.title)}`
    };

    const updatedBooks = [...books, bookToAdd];
    setBooks(updatedBooks);
    await saveBooks(updatedBooks);
    setShowAddModal(false);
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      const updatedBooks = books.filter(book => book.id !== bookId);
      setBooks(updatedBooks);
      await saveBooks(updatedBooks);
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAddBook={() => setShowAddModal(true)} />
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-6">
          <Sidebar 
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          <main className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6 min-h-[600px]">
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  {filteredBooks.length} books available
                </p>
              </div>

              {filteredBooks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No books found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your search or category</p>
                  {books.length === 0 && (
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                    >
                      <Plus className="w-4 h-4" />
                      Add Your First Book
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredBooks.map((book) => (
                    <BookCard 
                      key={book.id} 
                      book={book} 
                      onDelete={handleDeleteBook}
                    />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {showAddModal && (
        <AddBookModal 
          categories={categories}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddBook}
        />
      )}
    </div>
  );
}

export default Home;