using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace Book_System.Models
{
    public class BookBo
    {
        public class tblBooks
        {
            public tblBooks() { }
            public tblBooks(DataRow obj)
            {
                if (obj != null)
                {
                    this.BookId = Convert.ToInt32(obj["BookId"]);
                    this.BookName = obj["BookName"].ToString();
                    this.Author = obj["Author"].ToString();

                }
            }

            public int BookId { get; set; }
            public string BookName { get; set; }
            public string Author { get; set; }
        }

        public class tblClientDetails
        {
            public int ClientId { get; set; }
            public string ClientName { get; set; }
            public int BookId { get; set; }
            public string PurchaseDate { get; set; }
            public int BookRate { get; set; }
            public int ContactNumber { get; set; }
            public string Email { get; set; }
            public int Age { get; set; }
            public string Address { get; set; }
        }
    }
}