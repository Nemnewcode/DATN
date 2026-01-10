using System;
using System.Collections.Generic;

namespace TeaHouse.api.Models;

public partial class Inventory
{
    public int id { get; set; }

    public int product_id { get; set; }

    public int quantity { get; set; }

    public DateTime? last_update { get; set; }

    public bool? is_active { get; set; }

    public virtual Product product { get; set; } = null!;
}
