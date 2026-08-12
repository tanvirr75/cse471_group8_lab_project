export default function Input({ 
  label, 
  id, 
  error, 
  className = '', 
  ...props 
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {/* Simple label if provided */}
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      
      {/* Clean text input with clear focus states */}
      <input
        id={id}
        className={`flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 text-slate-900 ${
          error ? 'border-red-500 focus:ring-red-500' : ''
        } ${className}`}
        {...props}
      />
      
      {/* Simple error text if provided */}
      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  );
}
