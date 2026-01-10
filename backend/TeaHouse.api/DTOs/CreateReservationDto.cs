public class CreateReservationDto
{
    public string customer_name { get; set; } = null!;
    public string phone { get; set; } = null!;
    public string? email { get; set; }
    public DateOnly reservation_date { get; set; }
    public TimeOnly reservation_time { get; set; }
    public int number_of_people { get; set; }
    public string? note { get; set; }
}
