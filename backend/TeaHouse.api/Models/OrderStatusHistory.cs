using System;
using System.Collections.Generic;

namespace TeaHouse.api.Models;

public partial class OrderStatusHistory
{
    public int id { get; set; }

    public int order_id { get; set; }

    public string status { get; set; } = null!;

    public DateTime? updated_at { get; set; }

    public int updated_by { get; set; }

    public virtual Order order { get; set; } = null!;

    public virtual User updated_byNavigation { get; set; } = null!;
}
