
import React from 'react';
import { VIP_PRICE_PER_MONTH, CheckIcon } from '../constants.tsx';

interface TierModalProps {
  onClose: () => void;
  onUpgrade: () => void;
}

export const TierModal: React.FC<TierModalProps> = ({ onClose, onUpgrade }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out">
      <div className="bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-md transform transition-all duration-300 ease-in-out scale-100 opacity-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Upgrade to VIP</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 text-gray-300">
          <p className="text-lg">Unlock the full potential of PicturePerfect AI!</p>
          <ul className="space-y-2 text-sm">
            {[
              'Unlimited AI Generations',
              'Access to NSFW Content Generation',
              'Priority Support (Conceptual)',
              'Early Access to New Features (Conceptual)',
            ].map((feature, index) => (
              <li key={index} className="flex items-center">
                <CheckIcon className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 text-center">
          <p className="text-3xl font-extrabold text-white mb-1">
            ${VIP_PRICE_PER_MONTH} <span className="text-base font-normal text-gray-400">/ month</span>
          </p>
          <p className="text-xs text-gray-500 mb-6">Billed monthly. Cancel anytime (conceptually).</p>
          <button
            onClick={onUpgrade}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Go VIP Now
          </button>
          <button
            onClick={onClose}
            className="w-full mt-3 text-gray-400 hover:text-gray-200 py-2 px-4 rounded-lg transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};
