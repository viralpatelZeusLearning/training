// // See https://aka.ms/new-console-template for more information
// using System.Data;

// Console.WriteLine("Hello, World!");
// List<int> b = new List<int>{1,2,3,8,5}; //list
// b.Sort();
// int []c = {1,2,3,5}; //arr
// foreach (var item in b)
// {
//     Console.Write(item);
// }
// foreach (var item in c)
// {
//     Console.WriteLine(item);
//     if (item>2)
//     {
//         Console.Write("A");
//     }
// }   
// Random dice= new Random();//random class
// int score = 0;
// for (int i = 0; i < 5; i++)
// {   int roll1 = dice.Next(8);
//     int roll2 = dice.Next(1,7);
//     int roll3 = dice.Next(1,7);
//     if ((roll1 == roll2) && (roll2 == roll3)){
//         score += 2;
//     }
// }
// Console.WriteLine(score);

// int []nums = {1,100,5,5,4245};
// int sum = 0;
// nums.Append(10);

// foreach(int i in nums){
//     sum +=i;
//     Console.WriteLine(i);
// }

// string message = "(What if) I am (only interested) in the last (set of parentheses)?";
// int openingPosition = message.LastIndexOf('(');

// openingPosition += 1;
// int closingPosition = message.LastIndexOf(')');
// int length = closingPosition - openingPosition;
// Console.WriteLine(message.Substring(openingPosition, length));

// string msgt = "this -- is string";
// msgt.Replace("--"," ");

// const string input = "<div><h2>Widgets &trade;</h2><span>5000</span></div>";
// string quantity = "";
// const string openspan = "<span>";
// const string closespan = "</span>";
// int  openspanLength = input.IndexOf(openspan) + openspan.Length;
// int closespanLength = input.IndexOf(closespan);
// int quantityLength = closespanLength - openspanLength;
// quantity = input.Substring(openspanLength,quantityLength);
// Console.WriteLine(quantity);

//mini calc

int number1 = 0;
int number2 = 0;
int result = 0;
int choice = 0;
do {
    Console.WriteLine(@"--menu--
                    1. Add
                    2.Subtract
                    3.Multiply
                    4.Exit");
    Console.WriteLine("Enter the choice");
    while (!Int32.TryParse(Console.ReadLine(),out choice))
    {
        Console.WriteLine("Enter a valid Choice");
    }
    
    switch (choice)
    {
        case 1:
            while (!Int32.TryParse(Console.ReadLine(), out number1))
            {
                Console.WriteLine("enter a valid number");
            }
            while (!Int32.TryParse(Console.ReadLine(), out number2))
            {
                Console.WriteLine("enter a valid number");
            }
            result = number1 + number2;
            Console.WriteLine(result);
            break;
        case 2:
            while (!Int32.TryParse(Console.ReadLine(), out number1))
            {
                Console.WriteLine("enter a valid number");
            }
            while (!Int32.TryParse(Console.ReadLine(), out number2))
            {
                Console.WriteLine("enter a valid number");
            }
            result = number1 - number2;
            Console.WriteLine(result);
            break;
        case 3:
            while (!Int32.TryParse(Console.ReadLine(), out number1))
            {
                Console.WriteLine("enter a valid number");
            }
            while (!Int32.TryParse(Console.ReadLine(), out number2))
            {
                Console.WriteLine("enter a valid number");
            }
            result = number1 * number2;
            Console.WriteLine(result);
            break;
    }
}while(choice!=0 && choice!=4);