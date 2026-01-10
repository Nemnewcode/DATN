using System;
using System.Collections.Generic;

namespace TeaHouse.api.Models;

public partial class Topping
{
    public int id { get; set; }

    public string name { get; set; } = null!;

    public decimal price { get; set; }

    public bool? is_active { get; set; }

    public virtual ICollection<OrderTopping> OrderToppings { get; set; } = new List<OrderTopping>();

    public virtual ICollection<ProductTopping> ProductToppings { get; set; } = new List<ProductTopping>();
}
