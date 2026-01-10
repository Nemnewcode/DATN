using System;
using System.Collections.Generic;

namespace TeaHouse.api.Models;

public partial class Order
{
    public int id { get; set; }

    public int user_id { get; set; }

    public decimal total { get; set; }

    public string status { get; set; } = null!;

    public DateTime? created_at { get; set; }

    public int? discount_id { get; set; }

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual ICollection<OrderStatusHistory> OrderStatusHistories { get; set; } = new List<OrderStatusHistory>();

    public virtual Discount? discount { get; set; }

    public virtual User user { get; set; } = null!;
}
