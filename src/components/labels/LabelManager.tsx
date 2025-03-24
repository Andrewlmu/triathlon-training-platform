'use client';

import React, { useState } from 'react';
import { useLabels } from '@/context/LabelContext';
import { X, Plus, Trash, Check, Edit, RefreshCw } from 'lucide-react';
import { WorkoutLabel } from '@/types/workout';

/**
 * LabelManager Component
 *
 * Component for managing workout intensity labels.
 * Provides UI for creating, editing, deleting, and resetting workout labels.
 * Displays labels in a modal with color selection and name editing.
 *
 * @returns A component for managing workout labels
 */
export default function LabelManager() {
  // Get label data and functions from context
  const { labels, isLoading, addLabel, updateLabel, deleteLabel, resetToDefaultLabels } =
    useLabels();

  // Local state for UI management
  const [showModal, setShowModal] = useState(false);
  const [newLabelName, setNewLabelName] = useState('');
  const [newLabelColor, setNewLabelColor] = useState('#3B82F6');
  const [editMode, setEditMode] = useState<{ id: string; name: string; color: string } | null>(
    null
  );
  const [isResetting, setIsResetting] = useState(false);

  /**
   * Add a new label with the current input values
   */
  const handleAddLabel = async () => {
    if (!newLabelName.trim()) return;

    try {
      await addLabel({
        name: newLabelName.trim(),
        color: newLabelColor,
      });

      // Reset form after adding
      setNewLabelName('');
      setNewLabelColor('#3B82F6');
    } catch (error) {
      console.error('Failed to add label:', error);
    }
  };

  /**
   * Save changes to an existing label that's being edited
   */
  const handleUpdateLabel = async () => {
    if (!editMode || !editMode.name.trim()) return;

    try {
      await updateLabel(editMode.id, {
        name: editMode.name.trim(),
        color: editMode.color,
      });

      // Exit edit mode after updating
      setEditMode(null);
    } catch (error) {
      console.error('Failed to update label:', error);
    }
  };

  /**
   * Delete a label after confirmation
   *
   * @param id - ID of the label to delete
   */
  const handleDeleteLabel = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this label?')) {
      try {
        await deleteLabel(id);
      } catch (error) {
        console.error('Failed to delete label:', error);
      }
    }
  };

  /**
   * Reset to default training zone labels after confirmation
   */
  const handleResetLabels = async () => {
    if (
      window.confirm(
        'Are you sure you want to reset to default labels? This will delete all your custom labels.'
      )
    ) {
      try {
        setIsResetting(true);
        await resetToDefaultLabels();
      } catch (error) {
        console.error('Failed to reset labels:', error);
      } finally {
        setIsResetting(false);
      }
    }
  };

  // Predefined color options for label creation and editing
  const colorOptions = [
    '#9CA3AF', // Gray
    '#3B82F6', // Blue
    '#10B981', // Green
    '#84CC16', // Yellow-green (sweet spot)
    '#FBBF24', // Yellow
    '#EF4444', // Red
    '#DC2626', // Darker red (anaerobic)
    '#991B1B', // Darkest red (sprints)
    '#8B5CF6', // Purple
    '#EC4899', // Pink
  ];

  // Order labels by training intensity for consistent display
  const orderedLabels = [...labels].sort((a, b) => {
    // Physiological order of training zones
    const zoneOrder = [
      'Recovery',
      'Zone 2',
      'Tempo',
      'Sweet Spot',
      'Threshold',
      'VO2 Max',
      'Anaerobic',
      'Sprints',
    ];

    const indexA = zoneOrder.indexOf(a.name);
    const indexB = zoneOrder.indexOf(b.name);

    // If both labels are in predefined zones, sort by intensity
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    // If only one label is a standard zone, prioritize it
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;

    // Otherwise sort alphabetically
    return a.name.localeCompare(b.name);
  });

  return (
    <div>
      {/* Button to open the label manager modal */}
      <button
        onClick={() => setShowModal(true)}
        className="block px-4 py-2 text-sm font-medium text-white bg-[#333333] hover:bg-[#444444] rounded-md transition"
      >
        Manage Labels
      </button>

      {/* Label Manager Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-[#1E1E1E] rounded-lg shadow-2xl w-full max-w-md border border-[#333333]">
            {/* Modal Header */}
            <div className="p-4 border-b border-[#333333] flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Manage Labels</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#A0A0A0] hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4">
              {/* Reset Labels Button */}
              <div className="mb-4">
                <button
                  onClick={handleResetLabels}
                  disabled={isResetting || isLoading}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#333333] hover:bg-[#444444] rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`h-4 w-4 ${isResetting ? 'animate-spin' : ''}`} />
                  {isResetting ? 'Resetting...' : 'Reset to Default Labels'}
                </button>
              </div>

              {/* Existing Labels List */}
              <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
                {isLoading ? (
                  <p className="text-[#A0A0A0]">Loading labels...</p>
                ) : orderedLabels.length === 0 ? (
                  <p className="text-[#A0A0A0]">No labels yet. Create your first label below.</p>
                ) : (
                  orderedLabels.map((label) => (
                    <div
                      key={label.id}
                      className="flex items-center justify-between p-2 rounded bg-[#252525]"
                    >
                      {editMode?.id === label.id ? (
                        /* Edit Mode UI */
                        <>
                          <div className="flex items-center gap-2 flex-grow">
                            <div
                              className="h-4 w-4 rounded-full"
                              style={{ backgroundColor: editMode.color }}
                            ></div>
                            <input
                              type="text"
                              value={editMode.name}
                              onChange={(e) => setEditMode({ ...editMode, name: e.target.value })}
                              className="bg-[#333333] text-white border-none rounded p-1 flex-grow"
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="flex gap-1 mr-2">
                              {colorOptions.map((color) => (
                                <button
                                  key={color}
                                  type="button"
                                  className={`h-5 w-5 rounded-full hover:ring-2 hover:ring-white ${
                                    editMode.color === color ? 'ring-2 ring-white' : ''
                                  }`}
                                  style={{ backgroundColor: color }}
                                  onClick={() => setEditMode({ ...editMode, color })}
                                ></button>
                              ))}
                            </div>
                            <button
                              onClick={handleUpdateLabel}
                              className="p-1 text-green-500 hover:text-green-400"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditMode(null)}
                              className="p-1 text-red-500 hover:text-red-400"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </>
                      ) : (
                        /* View Mode UI */
                        <>
                          <div className="flex items-center gap-2">
                            <div
                              className="h-4 w-4 rounded-full"
                              style={{ backgroundColor: label.color }}
                            ></div>
                            <span className="text-white">{label.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                setEditMode({
                                  id: label.id,
                                  name: label.name,
                                  color: label.color,
                                })
                              }
                              className="p-1 text-[#A0A0A0] hover:text-white"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteLabel(label.id)}
                              className="p-1 text-[#A0A0A0] hover:text-red-500"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Add New Label Form */}
              <div className="pt-4 border-t border-[#333333]">
                <h3 className="text-sm font-semibold text-white mb-2">Add New Label</h3>
                <div className="flex gap-2">
                  <div className="flex-grow">
                    <input
                      type="text"
                      value={newLabelName}
                      onChange={(e) => setNewLabelName(e.target.value)}
                      className="w-full rounded-md border border-[#333333] bg-[#252525] p-2 text-white"
                      placeholder="Label name"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="color"
                      value={newLabelColor}
                      onChange={(e) => setNewLabelColor(e.target.value)}
                      className="sr-only"
                      id="color-picker"
                    />
                    <div
                      className="h-10 w-10 rounded-md cursor-pointer"
                      style={{ backgroundColor: newLabelColor }}
                      onClick={() => document.getElementById('color-picker')?.click()}
                    ></div>
                  </div>
                  <button
                    onClick={handleAddLabel}
                    className="p-2 text-white bg-[#252525] hover:bg-[#333333] rounded-md"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                {/* Color Palette Shortcuts */}
                <div className="flex gap-1 mt-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`h-6 w-6 rounded-full hover:ring-2 hover:ring-white ${
                        newLabelColor === color ? 'ring-2 ring-white' : ''
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewLabelColor(color)}
                    ></button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#333333] flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-[#333333] hover:bg-[#444444] rounded-md transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
