using System;
using System.Collections.Generic;

namespace TeaHouse.api.Models;

public partial class FeaturedNews
{
    public int id { get; set; }

    public string title { get; set; } = null!;

    public string slug { get; set; } = null!;

    public string? short_description { get; set; }

    public string recipe_content { get; set; } = null!;

    public string? thumbnail { get; set; }

    public int drink_id { get; set; }

    public bool? is_active { get; set; }

    public DateTime? created_at { get; set; }

    public DateTime? updated_at { get; set; }

    public int created_by { get; set; }

    public virtual User created_byNavigation { get; set; } = null!;

    public virtual Product drink { get; set; } = null!;
}
