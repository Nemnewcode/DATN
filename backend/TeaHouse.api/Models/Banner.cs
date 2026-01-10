using System;
using System.Collections.Generic;

namespace TeaHouse.api.Models;

public partial class Banner
{
    public int id { get; set; }

    public string? title { get; set; }

    public string? image_url { get; set; }

    public string? link { get; set; }

    public bool? is_active { get; set; }
}
