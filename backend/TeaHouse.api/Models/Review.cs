using System;
using System.Collections.Generic;

namespace TeaHouse.api.Models;

public partial class Review
{
    public int id { get; set; }

    public int product_id { get; set; }

    public int user_id { get; set; }

    public int? rating { get; set; }

    public string? comment { get; set; }

    public DateTime? created_at { get; set; }

    public bool? is_approved { get; set; }

    public virtual Product product { get; set; } = null!;

    public virtual User user { get; set; } = null!;
}
