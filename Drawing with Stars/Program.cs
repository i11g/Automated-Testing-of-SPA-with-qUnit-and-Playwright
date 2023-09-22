namespace Drawing_with_Stars
{
    internal class Program
    {
        static void Main(string[] args)
        {
            int num = int.Parse(Console.ReadLine());

            for (int row = 1; row <= num; row++)
            {
                Console.Write($"row: {row} ");
                for (int column = 1; column <= num; column++)
                {
                    Console.Write(column + " ");
                }
                Console.WriteLine();
            }   
        }
    }
}