using System;
using System.Collections.Generic;

namespace TeaHouse.api.Models;

public partial class ProductTopping
{
    public int id { get; set; }

    public int product_id { get; set; }

    public int topping_id { get; set; }

    public virtual Product product { get; set; } = null!;

    public virtual Topping topping { get; set; } = null!;
}
