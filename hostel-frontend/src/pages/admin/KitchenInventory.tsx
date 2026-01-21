import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  PencilIcon,
  ArchiveBoxIcon,
  ArrowPathIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

export default function KitchenInventoryPage() {
  const hostelId = localStorage.getItem("selectedHostelId");

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [lowStockThreshold, setLowStockThreshold] = useState(10);

  const [newItem, setNewItem] = useState({
    itemName: "",
    quantity: "",
    unit: "kg"
  });

  const [editItem, setEditItem] = useState({
    id: "",
    itemName: "",
    quantity: "",
    unit: "kg"
  });

  const loadInventory = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/inventory/search", {
        params: { itemName: search, hostelId }
      });
      setItems(res.data);
    } catch (err) {
      console.error("Failed to load inventory", err);
    } finally {
      setLoading(false);
    }
  };

  const loadLowStockItems = async () => {
    try {
      const res = await api.get("/api/admin/inventory/low-stock", {
        params: { threshold: lowStockThreshold }
      });
      // Note: This endpoint returns all low stock items, not filtered by hostel
      // We'll filter them by hostelId on the frontend
      return res.data;
    } catch (err) {
      console.error("Failed to load low stock items", err);
      return [];
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      // Calculate low stock items from current hostel items
      const lowStockItems = items.filter(item => item.quantity <= lowStockThreshold);
      // You could also call loadLowStockItems() if you want server-side filtering
    }
  }, [lowStockThreshold, items]);

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      loadInventory();
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/admin/inventory", newItem, {
        params: { hostelId }
      });
      setNewItem({ itemName: "", quantity: "", unit: "kg" });
      setShowAddModal(false);
      loadInventory();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add item");
    }
  };

  const handleEditItem = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/admin/inventory/${editItem.id}`, {
        itemName: editItem.itemName,
        quantity: editItem.quantity,
        unit: editItem.unit
      }, {
        params: { hostelId }
      });
      setShowEditModal(false);
      loadInventory();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update item");
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity === "" || isNaN(quantity)) return;
    try {
      await api.patch(`/api/admin/inventory/${id}/quantity`, null, {
        params: { quantity: parseFloat(quantity) }
      });
      loadInventory();
    } catch (err) {
      alert("Failed to update quantity");
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item from inventory?")) return;
    try {
      await api.delete(`/api/admin/inventory/${id}`);
      loadInventory();
    } catch (err) {
      alert("Failed to delete item");
    }
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setEditItem({
      id: item.id,
      itemName: item.itemName,
      quantity: item.quantity,
      unit: item.unit
    });
    setShowEditModal(true);
  };

  // Filter low stock items from current hostel items
  const lowStockItems = items.filter(item => item.quantity <= lowStockThreshold);
  
  // Calculate total items and average quantity
  const totalItems = items.length;
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const averageQuantity = totalItems > 0 ? totalQuantity / totalItems : 0;

  // Unit options
  const unitOptions = [
    "kg", "g", "l", "ml", "pcs", "pack", "dozen", "bottle", "can", "box"
  ];

  if (loading && items.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-10 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kitchen Inventory</h1>
          <p className="text-gray-600 mt-1">Manage kitchen stock and supplies</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={loadInventory}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
          >
            <ArrowPathIcon className="h-5 w-5" />
            Refresh
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <PlusIcon className="h-5 w-5" />
            Add New Item
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Items</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalItems}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <ArchiveBoxIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Quantity</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {totalQuantity.toFixed(1)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <ArchiveBoxIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Average Stock</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {averageQuantity.toFixed(1)}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <ArchiveBoxIcon className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Low Stock Items</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{lowStockItems.length}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Low Stock Filter */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Inventory Items
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by item name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && loadInventory()}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
              <button
                onClick={() => loadInventory()}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800"
              >
                Search
              </button>
            </div>
          </div>

          {/* Low Stock Threshold */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Low Stock Threshold
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-lg font-bold text-gray-700 min-w-[3rem]">
                ≤ {lowStockThreshold}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Items with quantity ≤ {lowStockThreshold} are considered low stock
            </p>
          </div>
        </div>

        {/* Low Stock Warning */}
        {lowStockItems.length > 0 && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl">
            <div className="flex items-center gap-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-red-800">
                  Low Stock Alert: {lowStockItems.length} item{lowStockItems.length !== 1 ? 's' : ''} need{lowStockItems.length === 1 ? 's' : ''} restocking
                </p>
                <p className="text-sm text-red-600 mt-1">
                  {lowStockItems.map(item => `${item.itemName} (${item.quantity} ${item.unit})`).join(', ')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Unit
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.length > 0 ? (
                items.map((item) => {
                  const isLowStock = item.quantity <= lowStockThreshold;
                  
                  return (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-gray-50 transition-colors ${
                        isLowStock ? 'bg-red-50' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {isLowStock && (
                            <div className="p-1 bg-red-100 rounded">
                              <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.itemName}
                            </div>
                            {isLowStock && (
                              <div className="text-xs text-red-600 font-medium">
                                Low Stock
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            step="0.1"
                            defaultValue={item.quantity}
                            onBlur={(e) => updateQuantity(item.id, e.target.value)}
                            className={`w-28 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                              isLowStock ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                          <span className="text-sm text-gray-500">
                            {item.unit}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                          {item.unit}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <ClockIcon className="h-4 w-4" />
                          {item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="inline-flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            <PencilIcon className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="inline-flex items-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            <TrashIcon className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <ArchiveBoxIcon className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No inventory items</h3>
                      <p className="text-gray-500 mb-4">
                        {search 
                          ? "No items match your search. Try a different search term."
                          : "Get started by adding your first inventory item."
                        }
                      </p>
                      <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                      >
                        <PlusIcon className="h-5 w-5" />
                        Add First Item
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fadeIn">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <PlusIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Add New Item</h2>
                    <p className="text-gray-600 text-sm">Add a new item to kitchen inventory</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter item name"
                    value={newItem.itemName}
                    onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="Enter quantity"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit
                    </label>
                    <select
                      value={newItem.unit}
                      onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    >
                      {unitOptions.map(unit => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-colors font-medium"
                  >
                    Add to Inventory
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fadeIn">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <PencilIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Edit Item</h2>
                    <p className="text-gray-600 text-sm">Update item details</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleEditItem} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={editItem.itemName}
                    onChange={(e) => setEditItem({ ...editItem, itemName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={editItem.quantity}
                      onChange={(e) => setEditItem({ ...editItem, quantity: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit
                    </label>
                    <select
                      value={editItem.unit}
                      onChange={(e) => setEditItem({ ...editItem, unit: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    >
                      {unitOptions.map(unit => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-colors font-medium"
                  >
                    Update Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}