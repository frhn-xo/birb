import React, { useEffect } from 'react';

const TextInput = React.forwardRef(
  (
    { type, styles, label, labelstyles, register, name, error, placeholder },
    ref
  ) => {
    return (
      <div className="text-slate-300  w-full flex flex-col mt-2">
        {label && (
          <p className={`font-semibold pb-2 ${labelstyles}`}>{label}</p>
        )}
        <div>
          <input
            placeholder={placeholder}
            autoComplete="off"
            type={type}
            name={name}
            ref={ref}
            className={`bg-inherit ring-indigo-900 ring-2 outline-none focus:ring-slate-300 rounded-lg font-semibold px-3 py-2 pt-1.5 w-full ${styles}`}
            {...register}
            aria-invalid={error ? 'true' : 'false'}
          />
        </div>
        {error && (
          <span className={`text-xs text-amber-500 mt-1`}>{error}</span>
        )}
      </div>
    );
  }
);

export default TextInput;
