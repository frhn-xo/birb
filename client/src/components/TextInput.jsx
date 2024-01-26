import React from 'react';

const TextInput = React.forwardRef(
  (
    { type, placeholder, styles, label, labelstyles, register, name, error },
    ref
  ) => {
    return (
      <div>
        {label && <p>{label}</p>}
        <div>
          <input
            className="bg-slate-950 text-white rounded-lg p-1 px-2 ring-2 ring-indigo-900"
            type={type}
            name={name}
            placeholder={placeholder}
            ref={ref}
            {...register}
          />
        </div>
        {error && <span>{error}</span>}
      </div>
    );
  }
);

export default TextInput;
