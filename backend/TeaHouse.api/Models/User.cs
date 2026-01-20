using System;
using System.Collections.Generic;

namespace TeaHouse.api.Models;

public partial class User
{
    public int id { get; set; }

    public string name { get; set; } = null!;

    public string email { get; set; } = null!;

    public string password { get; set; } = null!;

    public string role { get; set; } = null!;

    public bool? is_active { get; set; }

    public DateTime? created_at { get; set; }

    public string username { get; set; } = null!;
    public string? phone { get; set; }
    public string? address { get; set; }


    public virtual ICollection<FeaturedNews> FeaturedNews { get; set; } = new List<FeaturedNews>();

    public virtual ICollection<OrderStatusHistory> OrderStatusHistories { get; set; } = new List<OrderStatusHistory>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual ICollection<TableReservation> TableReservations { get; set; } = new List<TableReservation>();
}
