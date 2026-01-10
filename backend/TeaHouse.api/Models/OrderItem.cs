using System;
using System.Collections.Generic;

namespace TeaHouse.api.Models;

public partial class OrderItem
{
    public int id { get; set; }

    public int order_id { get; set; }

    public int product_id { get; set; }

    public int quantity { get; set; }

    public decimal price { get; set; }

    public virtual ICollection<OrderTopping> OrderToppings { get; set; } = new List<OrderTopping>();

    public virtual Order order { get; set; } = null!;

    public virtual Product product { get; set; } = null!;
}
