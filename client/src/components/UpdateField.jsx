import React, { useState } from "react";

const UpdateField = ({ initialValue, fieldLabel, fieldType, onClose, onUpdate }) => {
  const [updatedValue, setUpdatedValue] = useState(initialValue);

  const tempInitialValue = initialValue;
  const handleUpdate = () => {
    if (!updatedValue){
        onUpdate(tempInitialValue);
        onClose();
    }
    else{
        onUpdate(updatedValue);
        onClose();
    }
    
  };

  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-96">
        <h2 className="text-xl font-bold text-gray-100 mb-4">Edit {fieldLabel}</h2>
        <label className="block text-gray-300 mb-2">{fieldLabel}:</label>
        <input
          type={fieldType}
          value={updatedValue}
          onChange={(e) => setUpdatedValue(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded-lg border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="flex justify-end mt-4 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateField;
