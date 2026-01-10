using System;
using System.Collections.Generic;

namespace TeaHouse.api.Models;

public partial class Category
{
    public int id { get; set; }

    public string name { get; set; } = null!;

    public string? description { get; set; }

    public bool? is_active { get; set; }
    public string? slug { get; set; }

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
