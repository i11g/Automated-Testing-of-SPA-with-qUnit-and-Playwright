namespace Three_Rows_and_Two_Columns
{
    internal class Program
    {
        static void Main(string[] args)
        {
            int rows = 3;
            int columns = 2;

            for (int r = 1; r <=3 ; r++)
            {
                Console.WriteLine($"rows: {r}");
                for (int c = 1; c <=2; c++)
                {
                    Console.WriteLine($"columns: {c}");
                }

            }

        }
    }
}