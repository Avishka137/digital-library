import React, { useState, useEffect } from 'react';
import './Settings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    libraryName: 'VIKLIB',
    maxBorrowDays: 14,
    maxBooksPerUser: 5,
    lateFeesEnabled: true,
    lateFeePerDay: 1.00,
    emailNotifications: true,
    reminderDaysBefore: 3,
    allowReservations: true,
    autoRenewEnabled: false,
    theme: 'light'
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load settings from backend/localStorage
    const loadSettings = async () => {
      try {
        // Replace with actual API call
        // const response = await fetch('/api/settings');
        // const data = await response.json();
        // setSettings(data);
        
        // For now, load from localStorage
        const savedSettings = localStorage.getItem('librarySettings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setSaved(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Replace with actual API call
      // await fetch('/api/settings', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      // });

      // For now, save to localStorage
      localStorage.setItem('librarySettings', JSON.stringify(settings));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      const defaultSettings = {
        libraryName: 'VIKLIB',
        maxBorrowDays: 14,
        maxBooksPerUser: 5,
        lateFeesEnabled: true,
        lateFeePerDay: 1.00,
        emailNotifications: true,
        reminderDaysBefore: 3,
        allowReservations: true,
        autoRenewEnabled: false,
        theme: 'light'
      };
      setSettings(defaultSettings);
      setSaved(false);
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <div className="settings-icon-title">
          <span className="settings-icon">⚙️</span>
          <h1>Settings</h1>
        </div>
        <p className="settings-subtitle">Configure your library settings.</p>
      </div>

      <form onSubmit={handleSave} className="settings-form">
        {/* General Settings */}
        <div className="settings-section">
          <h2 className="section-title">General Settings</h2>
          
          <div className="form-group">
            <label htmlFor="libraryName">Library Name</label>
            <input
              type="text"
              id="libraryName"
              name="libraryName"
              value={settings.libraryName}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="theme">Theme</label>
            <select
              id="theme"
              name="theme"
              value={settings.theme}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </div>

        {/* Borrowing Rules */}
        <div className="settings-section">
          <h2 className="section-title">Borrowing Rules</h2>
          
          <div className="form-group">
            <label htmlFor="maxBorrowDays">Maximum Borrow Period (days)</label>
            <input
              type="number"
              id="maxBorrowDays"
              name="maxBorrowDays"
              value={settings.maxBorrowDays}
              onChange={handleInputChange}
              min="1"
              max="90"
              className="form-input"
            />
            <small className="form-help">How long users can keep borrowed books</small>
          </div>

          <div className="form-group">
            <label htmlFor="maxBooksPerUser">Maximum Books Per User</label>
            <input
              type="number"
              id="maxBooksPerUser"
              name="maxBooksPerUser"
              value={settings.maxBooksPerUser}
              onChange={handleInputChange}
              min="1"
              max="20"
              className="form-input"
            />
            <small className="form-help">How many books a user can borrow simultaneously</small>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="allowReservations"
                checked={settings.allowReservations}
                onChange={handleInputChange}
                className="form-checkbox"
              />
              <span>Allow Book Reservations</span>
            </label>
            <small className="form-help">Users can reserve books that are currently borrowed</small>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="autoRenewEnabled"
                checked={settings.autoRenewEnabled}
                onChange={handleInputChange}
                className="form-checkbox"
              />
              <span>Enable Auto-Renewal</span>
            </label>
            <small className="form-help">Automatically renew books if no one is waiting</small>
          </div>
        </div>

        {/* Late Fees */}
        <div className="settings-section">
          <h2 className="section-title">Late Fees</h2>
          
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="lateFeesEnabled"
                checked={settings.lateFeesEnabled}
                onChange={handleInputChange}
                className="form-checkbox"
              />
              <span>Enable Late Fees</span>
            </label>
          </div>

          {settings.lateFeesEnabled && (
            <div className="form-group">
              <label htmlFor="lateFeePerDay">Late Fee Per Day ($)</label>
              <input
                type="number"
                id="lateFeePerDay"
                name="lateFeePerDay"
                value={settings.lateFeePerDay}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="form-input"
              />
              <small className="form-help">Amount charged per day for overdue books</small>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="settings-section">
          <h2 className="section-title">Notifications</h2>
          
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleInputChange}
                className="form-checkbox"
              />
              <span>Enable Email Notifications</span>
            </label>
            <small className="form-help">Send email reminders to users</small>
          </div>

          {settings.emailNotifications && (
            <div className="form-group">
              <label htmlFor="reminderDaysBefore">Send Reminders (days before due)</label>
              <input
                type="number"
                id="reminderDaysBefore"
                name="reminderDaysBefore"
                value={settings.reminderDaysBefore}
                onChange={handleInputChange}
                min="1"
                max="7"
                className="form-input"
              />
              <small className="form-help">How many days before due date to send reminders</small>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="settings-actions">
          <button type="button" onClick={handleReset} className="btn-reset">
            Reset to Default
          </button>
          <button type="submit" className="btn-save">
            {saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>

        {saved && (
          <div className="save-notification">
            Settings saved successfully!
          </div>
        )}
      </form>
    </div>
  );
};

export default Settings;