namespace Three_Nested_Loops
{
    internal class Program
    {
        static void Main(string[] args)
        {
            for (int floor = 0; floor <=9; floor++)
            {
                for (int room = 0;  room<= 9; room++)
                {
                    for (int seat = 0; seat <= 9; seat++)
                    {
                        Console.WriteLine($"floor: {floor}; room: {room}; seat: {seat}");
                    }
                    Console.WriteLine("*");
                }
                Console.WriteLine("******");
            }
        }
    }
}