namespace TeaHouse.Api.DTOs.Discounts
{
    public class ApplyDiscountDto
    {
        public string code { get; set; } = null!;
        public decimal order_total { get; set; }
    }
}
