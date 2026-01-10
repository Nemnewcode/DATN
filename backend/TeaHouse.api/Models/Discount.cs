using System;
using System.Collections.Generic;

namespace TeaHouse.api.Models;

public partial class Discount
{
    public int id { get; set; }

    public string code { get; set; } = null!;

    public string discount_type { get; set; } = null!;

    public decimal value { get; set; }

    public DateTime? start_date { get; set; }

    public DateTime? end_date { get; set; }

    public bool? is_active { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
