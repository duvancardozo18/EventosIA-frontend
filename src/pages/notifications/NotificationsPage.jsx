"use client"

import { useState, useEffect, useRef } from "react"
import { useNotifications } from "../../hooks/useNotifications"
import NotificationItem from "../../components/Notification/NotificationItem"
import { Bell, Search, Filter, X, RefreshCw, AlertCircle, CheckCircle, ChevronDown, Inbox, Clock } from "lucide-react"

const NotificationsPage = () => {
  const {
    filteredNotifications,
    loading,
    error,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    unreadCount,
  } = useNotifications()

  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  const filterMenuRef = useRef(null)
  const searchInputRef = useRef(null)

  // Handle outside clicks for filter menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setIsFilterMenuOpen(false)
      }
    }

    if (isFilterMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isFilterMenuOpen])

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  const handleRefresh = () => {
    fetchNotifications()
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setIsSearchOpen(false)
  }

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
    setIsFilterMenuOpen(false)
  }

  const toggleFilterMenu = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen)
  }

  // Get filter label
  const getFilterLabel = () => {
    switch (filter) {
      case "read":
        return "Leídas"
      case "unread":
        return "No leídas"
      default:
        return "Todas"
    }
  }

  // Get filter icon
  const getFilterIcon = () => {
    switch (filter) {
      case "read":
        return <CheckCircle size={16} className="mr-2" />
      case "unread":
        return <AlertCircle size={16} className="mr-2" />
      default:
        return <Clock size={16} className="mr-2" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#365486] to-[#4a6da8] text-white shadow-sm">
              <Bell size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Notificaciones</h1>
              <p className="text-gray-500 mt-1">
                {unreadCount > 0
                  ? `Tienes ${unreadCount} notificación${unreadCount !== 1 ? "es" : ""} sin leer`
                  : "No tienes notificaciones sin leer"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {isSearchOpen ? (
              <div className="relative flex-grow md:w-64 animate-fadeIn">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar notificaciones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#365486]/30 focus:border-[#365486] transition-all"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-[#365486] hover:border-[#365486]/50 transition-all focus:outline-none focus:ring-2 focus:ring-[#365486]/30"
                title="Buscar notificaciones"
              >
                <Search size={18} />
              </button>
            )}

            {/* Filter Dropdown */}
            <div className="relative" ref={filterMenuRef}>
              <button
                onClick={toggleFilterMenu}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border ${
                  filter !== "all" ? "border-[#365486] text-[#365486] bg-[#365486]/5" : "border-gray-300 text-gray-600"
                } hover:bg-gray-100 hover:text-[#365486] hover:border-[#365486]/50 transition-all focus:outline-none focus:ring-2 focus:ring-[#365486]/30`}
                title="Filtrar notificaciones"
              >
                <Filter size={18} />
                <span className="hidden md:inline">{getFilterLabel()}</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${isFilterMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Filter Menu */}
              {isFilterMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 animate-fadeIn overflow-hidden">
                  <div className="py-1">
                    <button
                      onClick={() => handleFilterChange("all")}
                      className={`flex items-center w-full px-4 py-2.5 text-sm ${
                        filter === "all" ? "bg-[#365486] text-white" : "text-gray-700 hover:bg-gray-50"
                      } transition-colors`}
                    >
                      <Clock size={16} className="mr-2" />
                      <span>Todas</span>
                    </button>
                    <button
                      onClick={() => handleFilterChange("unread")}
                      className={`flex items-center w-full px-4 py-2.5 text-sm ${
                        filter === "unread" ? "bg-[#365486] text-white" : "text-gray-700 hover:bg-gray-50"
                      } transition-colors`}
                    >
                      <AlertCircle size={16} className="mr-2" />
                      <span>No leídas</span>
                    </button>
                    <button
                      onClick={() => handleFilterChange("read")}
                      className={`flex items-center w-full px-4 py-2.5 text-sm ${
                        filter === "read" ? "bg-[#365486] text-white" : "text-gray-700 hover:bg-gray-50"
                      } transition-colors`}
                    >
                      <CheckCircle size={16} className="mr-2" />
                      <span>Leídas</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-[#365486] hover:border-[#365486]/50 transition-all focus:outline-none focus:ring-2 focus:ring-[#365486]/30 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Actualizar notificaciones"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>

            {/* Mark All as Read Button (Desktop) */}
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#365486] to-[#4a6da8] text-white shadow-sm hover:shadow-md hover:from-[#2a4372] hover:to-[#3d5a8c] transition-all focus:outline-none focus:ring-2 focus:ring-[#365486]/50"
              >
                <CheckCircle size={18} />
                <span>Marcar todas como leídas</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Filters */}
        {(filter !== "all" || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2 mb-4 animate-fadeIn">
            <span className="text-sm text-gray-500">Filtros activos:</span>

            {filter !== "all" && (
              <div className="flex items-center gap-1.5 text-sm bg-[#365486]/10 text-[#365486] px-3 py-1.5 rounded-full">
                {getFilterIcon()}
                <span>{getFilterLabel()}</span>
                <button
                  onClick={() => handleFilterChange("all")}
                  className="ml-1 text-[#365486]/70 hover:text-[#365486] transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {searchQuery && (
              <div className="flex items-center gap-1.5 text-sm bg-[#365486]/10 text-[#365486] px-3 py-1.5 rounded-full">
                <Search size={14} />
                <span className="max-w-[200px] truncate">{searchQuery}</span>
                <button
                  onClick={handleClearSearch}
                  className="ml-1 text-[#365486]/70 hover:text-[#365486] transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* List Header */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 text-sm text-gray-500 hidden md:flex">
          <div className="w-8"></div>
          <div className="flex-1 ml-3">Mensaje</div>
          <div className="w-32 text-right">Fecha</div>
          <div className="w-20 text-center">Acciones</div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="h-12 w-12 mb-4 animate-spin rounded-full border-3 border-[#365486]/20 border-t-[#365486]"></div>
            <p className="text-gray-600 font-medium">Cargando notificaciones...</p>
            <p className="text-gray-400 text-sm mt-1">Esto puede tomar un momento</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <p className="text-red-500 font-medium mb-2">{error}</p>
            <p className="text-gray-500 text-sm mb-4">No pudimos cargar tus notificaciones</p>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-[#365486] text-white rounded-lg hover:bg-[#2a4372] transition-all shadow-sm"
            >
              <RefreshCw size={16} />
              <span>Intentar de nuevo</span>
            </button>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
              <Inbox size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-700 font-medium mb-2">No hay notificaciones</p>
            <p className="text-gray-500 text-sm max-w-md">
              {searchQuery
                ? "No se encontraron notificaciones que coincidan con tu búsqueda"
                : filter !== "all"
                  ? `No tienes notificaciones ${filter === "read" ? "leídas" : "sin leer"}`
                  : "No tienes notificaciones en este momento"}
            </p>
            {(searchQuery || filter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("")
                  setFilter("all")
                  setIsSearchOpen(false)
                }}
                className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all flex items-center gap-2"
              >
                <X size={16} />
                <span>Limpiar filtros</span>
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id_notification}
                notification={notification}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mobile Floating Action Button */}
      {unreadCount > 0 && (
        <div className="fixed bottom-6 right-6 md:hidden z-10">
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-[#365486] to-[#4a6da8] text-white shadow-lg hover:shadow-xl hover:from-[#2a4372] hover:to-[#3d5a8c] transition-all"
          >
            <CheckCircle size={18} />
            <span>Marcar todas como leídas</span>
          </button>
        </div>
      )}

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default NotificationsPage
