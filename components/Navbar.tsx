
import React from 'react';
import { UserTier } from '../types';
import { WandIcon } from '../constants.tsx'; // Re-using WandIcon as a logo

interface NavbarProps {
  userTier: UserTier;
  onUpgrade: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ userTier, onUpgrade }) => {
  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <WandIcon className="h-8 w-8 text-indigo-400" />
            <span className="ml-3 font-bold text-2xl text-white">PicturePerfect AI</span>
          </div>
          <div className="flex items-center">
            <span className={`px-3 py-1 mr-4 rounded-full text-sm font-semibold
              ${userTier === UserTier.VIP ? 'bg-yellow-500 text-yellow-900' : 'bg-indigo-500 text-indigo-100'}`}>
              {userTier} User
            </span>
            {userTier === UserTier.Free && (
              <button
                onClick={onUpgrade}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105"
              >
                Upgrade to VIP
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
