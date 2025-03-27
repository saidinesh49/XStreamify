return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-white">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 h-16 bg-surface-800/95 backdrop-blur-sm border-b border-surface-700 z-50">
            <div className="container mx-auto h-full px-4 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <img src="/logo.png" alt="XStreamify" className="h-8 w-8" />
                    <span className="text-xl font-bold bg-gradient-to-r from-premium-400 to-premium-600 bg-clip-text text-transparent">
                        XStreamify
                    </span>
                </Link>

                {/* Search Bar */}
                <div className="flex-1 max-w-2xl mx-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search videos..."
                            className="w-full px-4 py-2 bg-surface-700/50 border border-surface-600 rounded-full focus:outline-none focus:border-premium-500 transition-colors"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button 
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-premium-500"
                            onClick={handleSearch}
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex items-center gap-4">
                    <Link 
                        to="/upload" 
                        className="p-2 hover:bg-premium-500/10 rounded-full transition-colors"
                    >
                        <Upload className="w-5 h-5" />
                    </Link>
                    <Link 
                        to="/notifications" 
                        className="p-2 hover:bg-premium-500/10 rounded-full transition-colors"
                    >
                        <Bell className="w-5 h-5" />
                    </Link>
                    {isAuthenticated ? (
                        <div className="relative">
                            <button 
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 p-1 hover:bg-premium-500/10 rounded-full transition-colors"
                            >
                                <img 
                                    src={user.avatar} 
                                    alt={user.username}
                                    className="w-8 h-8 rounded-full border-2 border-premium-500"
                                />
                            </button>
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-surface-800 border border-surface-700 rounded-lg shadow-lg overflow-hidden animate-fade-in">
                                    <Link 
                                        to="/profile" 
                                        className="block px-4 py-2 hover:bg-premium-500/10"
                                    >
                                        Profile
                                    </Link>
                                    <Link 
                                        to="/settings" 
                                        className="block px-4 py-2 hover:bg-premium-500/10"
                                    >
                                        Settings
                                    </Link>
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-500/10"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link 
                            to="/login"
                            className="px-6 py-2 bg-gradient-to-r from-premium-500 to-premium-600 text-black rounded-full hover:from-premium-600 hover:to-premium-700 transition-colors"
                        >
                            Login
                        </Link>
                    )}
                </nav>
            </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4">
            {children}
        </main>
    </div>
); 