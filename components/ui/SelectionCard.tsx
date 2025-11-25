
import * as React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface SelectionCardProps {
  selected: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  desc?: string;
  compact?: boolean;
}

const SelectionCard: React.FC<SelectionCardProps> = ({ selected, onClick, icon: Icon, label, desc, compact = false }) => (
  <button 
    onClick={onClick}
    className={`
      relative group flex flex-col items-center justify-center rounded-xl border-2 transition-all duration-200
      ${compact ? 'p-3 gap-2' : 'p-4 gap-3'}
      ${selected 
        ? 'border-atelier-orange bg-white shadow-md ring-1 ring-atelier-orange/20' 
        : 'border-transparent bg-white shadow-sm hover:border-gray-200 hover:shadow-md'
      }
    `}
  >
    <div className={`
      rounded-full flex items-center justify-center transition-colors
      ${compact ? 'w-8 h-8' : 'w-10 h-10'}
      ${selected ? 'bg-atelier-orange text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'}
    `}>
      <Icon className={compact ? "w-4 h-4" : "w-5 h-5"} />
    </div>
    <div className="text-center">
        <span className={`block font-bold leading-tight ${compact ? 'text-xs' : 'text-sm'} ${selected ? 'text-atelier-charcoal' : 'text-gray-700'}`}>{label}</span>
        {desc && !compact && <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1 block">{desc}</span>}
    </div>
    
    {selected && (
      <div className="absolute top-2 right-2">
        <CheckCircle2 className="w-3.5 h-3.5 text-atelier-orange fill-white" />
      </div>
    )}
  </button>
);

export default SelectionCard;
