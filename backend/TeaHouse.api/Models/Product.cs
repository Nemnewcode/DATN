using System;
using System.Collections.Generic;

namespace TeaHouse.api.Models;

public partial class Product
{
    public int id { get; set; }

    public string name { get; set; } = null!;

    public decimal price { get; set; }

    public int category_id { get; set; }

    public string? description { get; set; }

    public string? image { get; set; }

    public string? status { get; set; }

    public bool? is_active { get; set; } = true;

    // ===== NAVIGATION =====
    public virtual Category category { get; set; } = null!;

    public virtual ICollection<FeaturedNews> FeaturedNews { get; set; } = new List<FeaturedNews>();
    public virtual ICollection<Inventory> Inventories { get; set; } = new List<Inventory>();
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public virtual ICollection<ProductImage> ProductImages { get; set; } = new List<ProductImage>();
    public virtual ICollection<ProductTopping> ProductToppings { get; set; } = new List<ProductTopping>();
    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
}
