namespace TeaHouse.Api.DTOs
{
    public class CreateOrderDto
    {
        public List<OrderItemDto> items { get; set; }
        public int? discount_id { get; set; }
    }

    public class OrderItemDto
    {
        public int product_id { get; set; }
        public int quantity { get; set; }
        public List<int>? topping_ids { get; set; }
    }
}
