import React from 'react';
import { Star, Cookie, Apple, Heart } from 'lucide-react';

interface ItemProps {
  index: number;
  type: 'star' | 'cookie' | 'apple' | 'heart';
}

export const GameItem: React.FC<ItemProps> = ({ index, type }) => {
  const colors = {
    star: 'text-yellow-400 fill-yellow-400',
    cookie: 'text-amber-600 fill-amber-300',
    apple: 'text-red-500 fill-red-500',
    heart: 'text-pink-500 fill-pink-500'
  };
  
  const Icons = {
    star: Star,
    cookie: Cookie,
    apple: Apple,
    heart: Heart
  };

  const Icon = Icons[type];

  return (
    <div className={`bounce-enter inline-block m-1 transform transition-all duration-300 hover:scale-125`}>
      <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${colors[type]}`} />
    </div>
  );
};

interface BasketProps {
  count: number;
  label: string;
  isFull?: boolean;
}

export const Basket: React.FC<BasketProps> = ({ count, label, isFull }) => {
  return (
    <div className={`
      relative flex flex-col items-center justify-end
      w-24 h-32 sm:w-32 sm:h-40 
      bg-white/50 border-4 border-b-8 rounded-2xl 
      transition-all duration-300
      ${isFull ? 'border-green-400 bg-green-50/50' : 'border-slate-300'}
    `}>
      <div className="flex flex-wrap justify-center content-end p-2 w-full h-full overflow-hidden">
         {Array.from({ length: count }).map((_, i) => (
            <GameItem key={i} index={i} type="apple" />
         ))}
      </div>
      <div className="absolute -bottom-10 font-bold text-slate-400 text-sm">{label}</div>
    </div>
  );
};