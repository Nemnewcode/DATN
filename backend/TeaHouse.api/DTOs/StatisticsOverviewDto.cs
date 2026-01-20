namespace Api.Dtos
{
    public class StatisticsOverviewDto
    {
        public decimal Revenue { get; set; }
        public int TotalOrders { get; set; }
        public int PendingBookings { get; set; }
        public int TotalProducts { get; set; }
    }
}
