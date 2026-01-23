using TeaHouse.api.Models;

public partial class Inventory
{
    public int id { get; set; }

    public int? product_id { get; set; } // không dùng

    public int? topping_id { get; set; } 

    public int quantity { get; set; }

    public DateTime? last_update { get; set; }

    public bool? is_active { get; set; }

    public virtual Topping? topping { get; set; }
}
