"use client";

import * as React from "react";
import Image from "next/image";
import {
  Boxes,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  DollarSign,
  Shield,
  Truck,
  Sparkles,
  X,
  Layers,
  Tag,
  Maximize2,
  Edit3,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/format";
import { CloudinaryUploader } from "@/components/shared/cloudinary-uploader";
import {
  RentalProduct,
  RentalCategory,
  RentalItemCondition,
} from "@/lib/rental-data";
import { useAuth } from "@/lib/supabase/auth-context";
import {
  getScopedRentalProducts,
  saveScopedRentalProduct,
  deleteScopedRentalProduct,
  isSeededDemoUser,
} from "@/lib/user-scoped-data";

export default function RentalInventoryPage() {
  const { user } = useAuth();
  const [products, setProducts] = React.useState<RentalProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [selectedCondition, setSelectedCondition] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<RentalProduct | null>(null);

  // Form State
  const [productForm, setProductForm] = React.useState({
    name: "",
    category: "audio_visual_lighting" as RentalCategory,
    description: "",
    dailyRate: 15000,
    securityDeposit: 20000,
    whiteGloveSetupFee: 3500,
    totalStock: 5,
    dimensions: "120cm x 60cm x 80cm",
    condition: "pristine" as RentalItemCondition,
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80",
    minRentalDays: 1,
    featuresText: "Professional flight case included, White-glove technician calibration",
    tagsText: "Audio, Luxury, Event Staging",
  });

  const loadProducts = React.useCallback(() => {
    setProducts(getScopedRentalProducts(user));
  }, [user]);

  React.useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      category: "audio_visual_lighting",
      description: "",
      dailyRate: 15000,
      securityDeposit: 20000,
      whiteGloveSetupFee: 3500,
      totalStock: 5,
      dimensions: "120cm x 60cm x 80cm",
      condition: "pristine",
      imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80",
      minRentalDays: 1,
      featuresText: "Professional flight case included, White-glove technician calibration",
      tagsText: "Audio, Luxury, Event Staging",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: RentalProduct) => {
    setEditingProduct(item);
    setProductForm({
      name: item.name,
      category: item.category,
      description: item.description,
      dailyRate: item.dailyRate,
      securityDeposit: item.securityDeposit,
      whiteGloveSetupFee: item.whiteGloveSetupFee,
      totalStock: item.totalStock,
      dimensions: item.dimensions,
      condition: item.condition,
      imageUrl: item.imageUrl,
      minRentalDays: item.minRentalDays || 1,
      featuresText: item.features.join(", "),
      tagsText: item.tags.join(", "),
    });
    setIsModalOpen(true);
  };

  const handleStockAdjust = (productId: string, delta: number) => {
    if (!user) return;
    const item = products.find((p) => p.id === productId);
    if (!item) return;
    const newStock = Math.max(0, item.totalStock + delta);
    const updated = { ...item, totalStock: newStock };
    saveScopedRentalProduct(user, updated);
    loadProducts();
  };

  const handleDeleteItem = (productId: string) => {
    if (!user) return;
    if (confirm("Are you sure you want to remove this equipment item from your rental fleet?")) {
      deleteScopedRentalProduct(user, productId);
      loadProducts();
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const saved: RentalProduct = {
      id: editingProduct ? editingProduct.id : `rent-${Date.now()}`,
      providerId: user.id,
      name: productForm.name,
      slug: productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category: productForm.category,
      description: productForm.description,
      dailyRate: Number(productForm.dailyRate),
      securityDeposit: Number(productForm.securityDeposit),
      whiteGloveSetupFee: Number(productForm.whiteGloveSetupFee),
      totalStock: Number(productForm.totalStock),
      dimensions: productForm.dimensions,
      condition: productForm.condition,
      imageUrl: productForm.imageUrl,
      minRentalDays: Number(productForm.minRentalDays),
      features: productForm.featuresText
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      tags: productForm.tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    saveScopedRentalProduct(user, saved);
    loadProducts();
    setIsModalOpen(false);
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === "all" || p.category === selectedCategory;
    const matchesCondition =
      selectedCondition === "all" || p.condition === selectedCondition;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesCondition && matchesSearch;
  });

  const getConditionColor = (cond: RentalItemCondition) => {
    switch (cond) {
      case "pristine":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
      case "good":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30";
      case "fair":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
      case "damaged":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Equipment Fleet & Inventory
            </h1>
            <Badge variant="outline" className="text-xs">
              {products.length} Fleet SKUs
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Manage your rental hardware catalog, stock quantities, replacement valuations, and daily rates.
          </p>
        </div>

        <Button
          onClick={openCreateModal}
          variant="champagne"
          className="gap-2 text-xs font-semibold cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Equipment SKU</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-card/80 p-3 rounded-2xl border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search equipment by name or specs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-secondary/80 border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-secondary/80 border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="audio_visual_lighting">Audio-Visual & Lighting</option>
            <option value="furniture_seating">Furniture & Seating</option>
            <option value="tableware_catering">Tableware & Vessels</option>
            <option value="structures_decor">Structures & Mandaps</option>
          </select>

          {/* Condition Filter */}
          <select
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            className="bg-secondary/80 border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none cursor-pointer"
          >
            <option value="all">All Conditions</option>
            <option value="pristine">Pristine</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="damaged">Needs Inspection</option>
          </select>
        </div>
      </div>

      {/* Grid of Equipment Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((item) => (
          <Card
            key={item.id}
            className="border-border bg-card overflow-hidden hover:border-primary/50 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Product Image Header */}
              <div className="relative h-44 w-full bg-muted overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                <div className="absolute top-2.5 left-2.5">
                  <Badge
                    variant="outline"
                    className={`text-[10px] uppercase font-semibold capitalize ${getConditionColor(
                      item.condition
                    )}`}
                  >
                    {item.condition}
                  </Badge>
                </div>
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-xs">
                  <span className="font-semibold">{item.dimensions}</span>
                  <span className="font-bold font-mono text-gold-headline-accent">
                    {formatINR(item.dailyRate)}/day
                  </span>
                </div>
              </div>

              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-editorial text-base font-bold text-foreground">
                    {item.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-xl bg-secondary/80 border border-border/60">
                  <div>
                    <span className="text-muted-foreground block">Deposit / Unit:</span>
                    <span className="font-bold text-foreground font-mono">
                      {formatINR(item.securityDeposit)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">White-Glove Setup:</span>
                    <span className="font-bold text-foreground font-mono">
                      {formatINR(item.whiteGloveSetupFee)}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  {item.features.slice(0, 2).map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
                    >
                      <Sparkles className="w-3 h-3 text-gold-primary shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </div>

            {/* Bottom Actions & Stock Controls */}
            <div className="p-4 pt-2 border-t border-border/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground">Stock:</span>
                <div className="flex items-center border border-border rounded-lg bg-secondary overflow-hidden">
                  <button
                    onClick={() => handleStockAdjust(item.id, -1)}
                    className="px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                    title="Decrease stock"
                  >
                    -
                  </button>
                  <span className="px-2.5 py-0.5 text-xs font-bold text-foreground">
                    {item.totalStock}
                  </span>
                  <button
                    onClick={() => handleStockAdjust(item.id, 1)}
                    className="px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                    title="Increase stock"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditModal(item)}
                  className="h-7 px-2.5 text-xs border-border text-foreground hover:bg-muted cursor-pointer gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteItem(item.id)}
                  className="h-7 w-7 p-0 text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                  title="Delete Equipment"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-card/60 rounded-3xl border border-dashed border-border p-8 space-y-3">
          <Boxes className="w-10 h-10 text-muted-foreground mx-auto opacity-50" />
          <h3 className="font-editorial text-lg font-bold text-foreground">
            No Equipment Found in Fleet
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {!isSeededDemoUser(user)
              ? "You haven't cataloged any equipment items yet. Click 'Add Equipment SKU' to start offering staging, lighting, or furniture to event planners."
              : "Try adjusting your search query, condition filter, or category pills."}
          </p>
          <Button
            onClick={openCreateModal}
            variant="champagne"
            size="sm"
            className="text-xs font-semibold mt-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Your First Equipment SKU
          </Button>
        </div>
      )}

      {/* Add / Edit Equipment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h2 className="font-editorial text-xl font-bold text-foreground">
                  {editingProduct ? "Edit Equipment SKU" : "Catalog New Equipment SKU"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Update equipment specifications, daily rates, and security deposit escrows.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">
                    Equipment / Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm({ ...productForm, name: e.target.value })
                    }
                    placeholder="e.g. Vintage Crystal Champagne Towers"
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        category: e.target.value as RentalCategory,
                      })
                    }
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none cursor-pointer"
                  >
                    <option value="audio_visual_lighting">Audio-Visual & Lighting</option>
                    <option value="furniture_seating">Furniture & Seating</option>
                    <option value="tableware_catering">Tableware & Vessels</option>
                    <option value="structures_decor">Structures & Mandaps</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({ ...productForm, description: e.target.value })
                  }
                  placeholder="Describe hardware technical specs, luxury finish, or rigging details..."
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">
                    Daily Rental Rate (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={500}
                    value={productForm.dailyRate}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        dailyRate: Number(e.target.value),
                      })
                    }
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">
                    Security Deposit (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={productForm.securityDeposit}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        securityDeposit: Number(e.target.value),
                      })
                    }
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">
                    Setup & Delivery (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={productForm.whiteGloveSetupFee}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        whiteGloveSetupFee: Number(e.target.value),
                      })
                    }
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Total Stock *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={productForm.totalStock}
                    onChange={(e) =>
                      setProductForm({ ...productForm, totalStock: Number(e.target.value) })
                    }
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Condition</label>
                  <select
                    value={productForm.condition}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        condition: e.target.value as RentalItemCondition,
                      })
                    }
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none cursor-pointer"
                  >
                    <option value="pristine">Pristine (Showroom Condition)</option>
                    <option value="good">Good (Minor Wear)</option>
                    <option value="fair">Fair (Functional)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Dimensions</label>
                  <input
                    type="text"
                    value={productForm.dimensions}
                    onChange={(e) =>
                      setProductForm({ ...productForm, dimensions: e.target.value })
                    }
                    placeholder="e.g. 200cm x 100cm x 75cm"
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                  />
                </div>
              </div>

              {/* Cloudinary Photo Uploader */}
              <CloudinaryUploader
                value={productForm.imageUrl}
                onChange={(url) => setProductForm({ ...productForm, imageUrl: url })}
                label="Equipment Showcase Photo"
                helperText="Upload 4K equipment photo via Cloudinary, or pick from curated luxury presets."
              />

              <div className="space-y-1">
                <label className="font-semibold text-foreground">
                  Key Features (comma-separated)
                </label>
                <input
                  type="text"
                  value={productForm.featuresText}
                  onChange={(e) =>
                    setProductForm({ ...productForm, featuresText: e.target.value })
                  }
                  placeholder="e.g. Gold Leaf Rim, Lead-Free Crystal, Flight Case"
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-foreground focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="champagne" size="sm" className="font-semibold cursor-pointer">
                  {editingProduct ? "Save Changes" : "Save & Add to Fleet"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
