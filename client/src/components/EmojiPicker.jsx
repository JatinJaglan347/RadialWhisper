import { useEffect, useRef } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

const EmojiPicker = ({ onEmojiSelect, visible = false, position = 'top' }) => {
  const pickerRef = useRef(null);

  // Close the picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target) && visible) {
        onEmojiSelect(null, { type: 'close' });
      }
    };

    // Handle key press events
    const handleKeyDown = (event) => {
      if (visible && event.key === 'Enter') {
        // Prevent the enter key from adding emojis when the picker is open
        event.preventDefault();
        // Close the emoji picker
        onEmojiSelect(null, { type: 'close' });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible, onEmojiSelect]);

  if (!visible) return null;

  // Calculate emoji size based on viewport width
  const getAdaptiveEmojiSize = () => {
    const width = window.innerWidth;
    if (width < 400) return 18; // Small mobile devices
    if (width < 768) return 20; // Mobile devices
    return 24; // Tablets and larger
  };

  return (
    <div 
      ref={pickerRef}
      className={`absolute z-20 ${position === 'top' ? 'bottom-14 left-0' : 'top-full mt-2'}`}
    >
      <Picker 
        data={data} 
        onEmojiSelect={onEmojiSelect}
        theme="dark"
        previewPosition="none"
        skinTonePosition="none"
        emojiSize={getAdaptiveEmojiSize()}
        emojiButtonSize={getAdaptiveEmojiSize() * 1.5}
        maxFrequentRows={2}
        dynamicWidth={false}
        autoFocus={true}
        width={320} // Fixed width
      />
    </div>
  );
};

export default EmojiPicker;
