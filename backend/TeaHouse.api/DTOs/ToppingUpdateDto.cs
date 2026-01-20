namespace TeaHouse.Api.DTOs.Toppings
{
    public class ToppingUpdateDto
    {
        public string name { get; set; }
        public decimal price { get; set; }
        public bool? is_active { get; set; }
    }
}
