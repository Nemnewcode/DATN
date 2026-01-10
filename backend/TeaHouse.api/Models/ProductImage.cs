using System;
using System.Collections.Generic;

namespace TeaHouse.api.Models;

public partial class ProductImage
{
    public int id { get; set; }

    public int product_id { get; set; }

    public string image_url { get; set; } = null!;

    public bool? is_main { get; set; }

    public bool? is_active { get; set; }

    public virtual Product product { get; set; } = null!;
}
