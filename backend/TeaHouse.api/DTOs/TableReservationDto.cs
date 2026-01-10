public class TableReservationDto
{
    public string customer_name { get; set; }
    public string phone { get; set; }
    public string email { get; set; }

    public DateTime reservation_date { get; set; }

    // 👇 
    public string reservation_time { get; set; }

    public int number_of_people { get; set; }
    public string? note { get; set; }
}
