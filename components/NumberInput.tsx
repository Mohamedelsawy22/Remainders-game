import React, { useState, useEffect } from 'react';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
}

export const NumberInput: React.FC<NumberInputProps> = ({ label, value, onChange, min, max }) => {
  // Local state to handle the input string, allowing it to be empty temporarily
  const [inputValue, setInputValue] = useState(value.toString());

  // Sync local state when prop value changes externally (e.g. via +/- buttons)
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setInputValue(newVal);

    // Only trigger parent update if it's a valid number
    if (newVal !== '') {
      const parsed = parseInt(newVal, 10);
      if (!isNaN(parsed)) {
        // Clamp immediately or allow free typing? 
        // For better UX, we clamp on blur, but here we'll clamp for safety 
        // if it exceeds length significantly, or just rely on max valid check.
        // Let's just pass it up if it's within logical bounds or valid.
        // To strictly enforce limits while typing:
        const clamped = Math.max(min, Math.min(max, parsed));
        // If we want to allow typing "1" then "10", we shouldn't clamp strictly if it interrupts typing.
        // But for this simple game, strict clamping is okay if max is small (9). 
        // For max 99, typing "1" is valid. Typing "9" is valid.
        // If user types "100", we clamp to "99".
        
        // We only update parent if it's a valid number. 
        // We don't clamp the string the user is typing unless it's out of bounds.
        if (parsed <= max) {
            onChange(parsed);
        } else {
            onChange(max);
        }
      }
    }
  };

  const handleBlur = () => {
    // On blur, reset to current valid prop value to ensure consistency
    let parsed = parseInt(inputValue, 10);
    if (isNaN(parsed) || inputValue === '') {
      parsed = min;
    } else {
      parsed = Math.max(min, Math.min(max, parsed));
    }
    onChange(parsed);
    setInputValue(parsed.toString());
  };

  return (
    <div className="flex flex-col items-center mx-2">
      <label className="text-sm font-bold text-slate-500 mb-1">{label}</label>
      <div className="flex items-center bg-white rounded-xl shadow-sm border-2 border-slate-200 p-1">
        <button 
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-8 h-8 flex items-center justify-center bg-sky-100 text-sky-600 rounded-lg hover:bg-sky-200 transition-colors font-bold"
        >
          -
        </button>
        
        <input 
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className="w-16 text-center text-xl font-bold text-slate-700 outline-none border-none bg-transparent m-0 [&::-webkit-inner-spin-button]:appearance-none"
        />
        
        <button 
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-8 h-8 flex items-center justify-center bg-sky-100 text-sky-600 rounded-lg hover:bg-sky-200 transition-colors font-bold"
        >
          +
        </button>
      </div>
    </div>
  );
};