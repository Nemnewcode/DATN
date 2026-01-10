using System;
using System.Collections.Generic;

namespace TeaHouse.api.Models;

public partial class TableReservation
{
    public int id { get; set; }

    public int? user_id { get; set; }

    public string customer_name { get; set; } = null!;

    public string phone { get; set; } = null!;

    public string? email { get; set; }

    public DateOnly reservation_date { get; set; }

    public TimeOnly reservation_time { get; set; }

    public int number_of_people { get; set; }

    public string? note { get; set; }

    public string status { get; set; } = null!;

    public DateTime? created_at { get; set; }

    public virtual User? user { get; set; }

   
}
