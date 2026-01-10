using System;
using System.Collections.Generic;

namespace TeaHouse.api.Models;

public partial class OrderTopping
{
    public int id { get; set; }

    public int order_item_id { get; set; }

    public int topping_id { get; set; }

    public virtual OrderItem order_item { get; set; } = null!;

    public virtual Topping topping { get; set; } = null!;
}
