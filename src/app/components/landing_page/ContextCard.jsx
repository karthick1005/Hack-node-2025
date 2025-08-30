export default function ContextCard({
  time,
  label,
  greeting,
  icon,
  description,
  priorityCards,
  actions,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-xs flex flex-col gap-4 border border-gray-100">
      <div className="flex items-center justify-between text-gray-500 text-sm mb-1">
        <span>{time}</span>
        <span className="bg-sky-500 text-white text-xs px-3 py-1 rounded-full font-semibold ml-2">
          {label}
        </span>
      </div>
      <div className="bg-sky-50 rounded-xl p-4 flex items-center justify-between mb-2">
        <div className="font-semibold text-gray-800">{greeting}</div>
        <span className="text-xl ml-2">{icon}</span>
      </div>
      <div className="text-gray-500 text-sm mb-2">{description}</div>
      <div className="font-bold text-xs text-gray-500 mb-1">PRIORITY CARDS</div>
      <div className="flex flex-col gap-3">{priorityCards}</div>
      <div className="flex justify-between items-center mt-4 gap-2">
        {actions}
      </div>
    </div>
  );
}
