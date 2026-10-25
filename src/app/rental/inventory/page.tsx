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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/format";
import {
  getStoredRentalProducts,
  addRentalProduct,
  saveStoredRentalProducts,
  CURRENT_RENTAL_PROVIDER,
  type RentalProduct,
  type RentalCategory,
  type RentalItemCondition,
} from "@/lib/rental-data";

export default function RentalInventoryPage() {
  const [products, setProducts] = React.useState<RentalProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [selectedCondition, setSelectedCondition] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  // New Equipment Form State
  const [newProduct, setNewProduct] = React.useState({
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

  React.useEffect(() => {
    setProducts(getStoredRentalProducts());
  }, []);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === "all" || p.category === selectedCategory;
    const matchesCondition =
      selectedCondition === "all" || p.condition === selectedCondition;
    const matchesSearch =
      searchQuery.trim() === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesCondition && matchesSearch;
  });

  // Handle Add Product Submission
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name.trim()) return;

    const features = newProduct.featuresText
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);
    const tags = newProduct.tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const created = addRentalProduct({
      providerId: CURRENT_RENTAL_PROVIDER.id,
      name: newProduct.name,
      category: newProduct.category,
      description: newProduct.description,
      dailyRate: Number(newProduct.dailyRate),
      securityDeposit: Number(newProduct.securityDeposit),
      whiteGloveSetupFee: Number(newProduct.whiteGloveSetupFee),
      totalStock: Number(newProduct.totalStock),
      dimensions: newProduct.dimensions,
      condition: newProduct.condition,
      imageUrl: newProduct.imageUrl,
      minRentalDays: Number(newProduct.minRentalDays),
      features,
      tags,
    });

    setProducts([created, ...products]);
    setIsAddModalOpen(false);
  };

  // Adjust stock
  const handleStockAdjust = (id: string, delta: number) => {
    const updated = products.map((p) => {
      if (p.id === id) {
        const next = Math.max(0, p.totalStock + delta);
        return { ...p, totalStock: next };
      }
      return p;
    });
    setProducts(updated);
    saveStoredRentalProducts(updated);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Equipment Fleet & Inventory
            </h1>
            <Badge variant="champagne" className="text-xs">
              {products.length} SKUs Cataloged
            </Badge>
          </div>
          <p className="text-xs text-hero-subtitle">
            Manage your staging, acoustic, banquet seating, and marquee assets. Track condition grades, per-day rental rates, and security deposits.
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          variant="champagne"
          size="sm"
          className="gap-1.5 text-xs shadow-sm font-semibold shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Equipment SKU</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-card/85 border border-border shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search gear by name, keyword, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-secondary/80 border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* Condition Select */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
              Condition:
            </span>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="bg-secondary/80 border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
            >
              <option value="all">All Conditions</option>
              <option value="pristine">Pristine (Showroom)</option>
              <option value="good">Good (Light Use)</option>
              <option value="fair">Fair (Serviceable)</option>
              <option value="damaged">Damaged / In Repair</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-border/60">
          {[
            { id: "all", label: "All Fleet Assets" },
            { id: "audio_visual_lighting", label: "AV & Stage Lighting" },
            { id: "furniture_seating", label: "Furniture & Seating" },
            { id: "tableware_catering", label: "Fine Tableware & Linens" },
            { id: "structures_decor", label: "Marquees & Structures" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-gold-primary text-white shadow-xs font-semibold"
                  : "bg-secondary/70 text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((item) => (
          <Card
            key={item.id}
            className="bg-card/90 border-border overflow-hidden hover:border-gold-primary/50 transition-all group flex flex-col justify-between"
          >
            <div>
              {/* Product Thumbnail Banner */}
              <div className="relative h-48 w-full bg-secondary overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className="bg-black/60 backdrop-blur-md text-white border-white/20 text-[10px] capitalize font-medium"
                  >
                    {item.category.replace(/_/g, " ")}
                  </Badge>

                  <Badge
                    className={`text-[10px] capitalize font-semibold shadow-xs ${
                      item.condition === "pristine"
                        ? "bg-emerald-500/90 text-white"
                        : item.condition === "good"
                        ? "bg-blue-500/90 text-white"
                        : item.condition === "fair"
                        ? "bg-amber-500/90 text-white"
                        : "bg-red-500/90 text-white"
                    }`}
                  >
                    {item.condition}
                  </Badge>
                </div>

                {/* Bottom Overlay Price info */}
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                  <div>
                    <span className="text-[11px] text-white/80 uppercase tracking-wider block">
                      Daily Rental
                    </span>
                    <span className="font-editorial text-xl font-bold">
                      {formatINR(item.dailyRate)}
                    </span>
                    <span className="text-xs text-white/70"> / day</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-white/80 block">
                      Sec. Deposit: {formatINR(item.securityDeposit)}
                    </span>
                    <span className="text-[10px] text-amber-300 block">
                      Setup Fee: {formatINR(item.whiteGloveSetupFee)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-foreground text-sm leading-tight group-hover:text-gold-headline-accent transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Dimensions & Min Days */}
                <div className="p-2.5 rounded-lg bg-secondary/70 border border-border/80 text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Dimensions:</span>
                    <span className="font-medium text-foreground truncate max-w-[180px]">
                      {item.dimensions}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Min Duration:</span>
                    <span className="font-medium text-foreground">
                      {item.minRentalDays} {item.minRentalDays > 1 ? "days" : "day"}
                    </span>
                  </div>
                </div>

                {/* Feature Highlights */}
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
            <div className="p-4 pt-0 border-t border-border/60 mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground">
                  Stock Units:
                </span>
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

              <Badge variant="outline" className="text-[10px] font-mono">
                SKU #{item.id.slice(0, 8)}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-card/60 rounded-2xl border border-dashed border-border space-y-3">
          <Boxes className="w-10 h-10 text-muted-foreground mx-auto opacity-50" />
          <h3 className="font-editorial text-lg font-bold text-foreground">
            No Equipment Found
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search query, condition filter, or category pills.
          </p>
          <Button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedCondition("all");
            }}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* Add Equipment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h2 className="font-editorial text-xl font-bold text-foreground">
                  Catalog New Equipment SKU
                </h2>
                <p className="text-xs text-muted-foreground">
                  Add equipment into your white-glove rental inventory fleet.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">
                    Equipment / Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    placeholder="e.g. Vintage Crystal Champagne Towers"
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Category *</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        category: e.target.value as RentalCategory,
                      })
                    }
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
                  >
                    <option value="audio_visual_lighting">AV & Stage Lighting</option>
                    <option value="furniture_seating">Furniture & Seating</option>
                    <option value="tableware_catering">Fine Tableware & Linens</option>
                    <option value="structures_decor">Marquees & Structures</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, description: e.target.value })
                  }
                  placeholder="Detailed specifications, luxury finish, and setup requirements..."
                  className="w-full bg-secondary border border-border rounded-lg p-3 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">
                    Per-Day Rental (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={newProduct.dailyRate}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, dailyRate: Number(e.target.value) })
                    }
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
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
                    value={newProduct.securityDeposit}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        securityDeposit: Number(e.target.value),
                      })
                    }
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
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
                    value={newProduct.whiteGloveSetupFee}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        whiteGloveSetupFee: Number(e.target.value),
                      })
                    }
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
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
                    value={newProduct.totalStock}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, totalStock: Number(e.target.value) })
                    }
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Initial Condition</label>
                  <select
                    value={newProduct.condition}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        condition: e.target.value as RentalItemCondition,
                      })
                    }
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
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
                    value={newProduct.dimensions}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, dimensions: e.target.value })
                    }
                    placeholder="e.g. 200cm x 100cm x 75cm"
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Image URL</label>
                <input
                  type="url"
                  value={newProduct.imageUrl}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, imageUrl: e.target.value })
                  }
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">
                  Key Features (comma-separated)
                </label>
                <input
                  type="text"
                  value={newProduct.featuresText}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, featuresText: e.target.value })
                  }
                  placeholder="e.g. Gold Leaf Rim, Lead-Free Crystal, Flight Case"
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="champagne">
                  Catalog Equipment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
