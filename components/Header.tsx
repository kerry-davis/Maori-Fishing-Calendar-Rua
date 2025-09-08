import React from 'react';

interface HeaderProps {
  onAction: (action: string) => void;
  onToggleTheme: () => void;
  isDarkTheme: boolean;
}

const Tooltip: React.FC<{ text: string, children: React.ReactNode }> = ({ text, children }) => {
    return (
        <div className="relative group flex items-center">
            {children}
            <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-slate-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                {text}
            </div>
        </div>
    );
};

const Header: React.FC<HeaderProps> = ({ onAction, onToggleTheme, isDarkTheme }) => {
    const iconStyle = "w-6 h-6 text-slate-400 hover:text-white transition-colors cursor-pointer";

    return (
      <header className="relative text-center">
        <h1 className="text-4xl font-bold text-slate-100 tracking-tight">Māori Fishing Calendar</h1>
        <p className="text-lg text-slate-400 mt-1">Find the best fishing days based on the Māori lunar calendar</p>
        
        <div className="absolute top-1/2 -translate-y-1/2 right-0 flex items-center space-x-4 bg-slate-800/50 border border-slate-700/50 px-4 py-2 rounded-full">
            <Tooltip text="Search Catches"><i className={`fa-solid fa-search ${iconStyle}`} onClick={() => onAction('search')}></i></Tooltip>
            <Tooltip text="Analytics"><i className={`fa-solid fa-chart-line ${iconStyle}`} onClick={() => onAction('analytics')}></i></Tooltip>
            <Tooltip text="Photo Gallery"><i className={`fa-solid fa-images ${iconStyle}`} onClick={() => onAction('gallery')}></i></Tooltip>
            <Tooltip text="Tackle Box"><i className={`fa-solid fa-toolbox ${iconStyle}`} onClick={() => onAction('tacklebox')}></i></Tooltip>
            <Tooltip text="Settings"><i className={`fa-solid fa-cog ${iconStyle}`} onClick={() => onAction('settings')}></i></Tooltip>
            <div className="w-px h-6 bg-slate-600"></div>
            <Tooltip text={isDarkTheme ? "Switch to Light Mode" : "Switch to Dark Mode"}>
                <i className={`fa-solid ${isDarkTheme ? 'fa-sun' : 'fa-moon'} ${iconStyle}`} onClick={onToggleTheme}></i>
            </Tooltip>
        </div>
      </header>
    );
};

export default Header;
