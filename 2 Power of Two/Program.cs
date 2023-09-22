using System.Diagnostics;

namespace _2_Power_of_Two
{
    internal class Program
    {
        static void Main(string[] args)
        {
            int num=int.Parse(Console.ReadLine());

            long result = 1;
            for (int i = 0; i <=num; i+=2)
            {
                if (i > 0)
                {
                    Console.Write(" , ");
                }
                Console.Write(result);
                result = result * 2 * 2;
            }
            
        }
    }
}