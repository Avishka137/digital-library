import React from 'react';
import { ChevronLeft, BookOpen, User, Book, Clock, Star } from 'lucide-react';

function BookReader({ book, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b flex items-center justify-between">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Library
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className={`h-64 ${book.coverImage} rounded-lg mb-6 flex items-center justify-center`}>
            <BookOpen className="w-24 h-24 text-white opacity-80" />
          </div>
          
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-gray-600 mb-1 flex items-center gap-2">
            <User className="w-4 h-4" />
            {book.author}
          </p>
          
          <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Book className="w-4 h-4" />
              {book.pages} pages
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {book.published}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              {book.rating}
            </span>
          </div>
          
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-3">About this book</h2>
            <p className="text-gray-700 mb-6">{book.description}</p>
            
            <h2 className="text-xl font-semibold mb-3">Preview</h2>
            <div className="whitespace-pre-line text-gray-800 leading-relaxed">
              {book.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookReader;