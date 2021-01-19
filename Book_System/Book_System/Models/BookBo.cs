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

        //public class tblClientDetailsList
        //{
        //    public tblClientDetailsList(){}
        //    public tblClientDetailsList(DataRow obj)
        //    {
        //        if (obj != null)
        //        {
        //            this.Age = Convert.ToInt32(obj["Age"]);
        //            this.BookId = Convert.ToInt32(obj["BookId"]);
        //            this.BookRate = Convert.ToInt32(obj["BookRate"]);
        //            this.ContactNumber = Convert.ToInt32(obj["ContactNumber"]);
        //            this.ClientName = obj["ClientName"].ToString();
        //            this.PurchaseDate = Convert.ToDateTime(obj["PurchaseDate"]);
        //            this.Email = obj["Email"].ToString();
        //            this.Address = obj["Address"].ToString();
        //            this.BookName = obj["BookName"].ToString();
        //        }
        //    }
        //    public int ClientId { get; set; }
        //    public string ClientName { get; set; }
        //    public int BookId { get; set; }
        //    public string BookName { get; set; }
        //    public DateTime? PurchaseDate { get; set; }
        //    public int BookRate { get; set; }
        //    public int ContactNumber { get; set; }
        //    public string Email { get; set; }
        //    public int Age { get; set; }
        //    public string Address { get; set; }
        //}
        public class tblClientDetails
        {
            public tblClientDetails(){}
            public tblClientDetails(DataRow obj)
            {
                if (obj != null)
                {
                    this.Age = Convert.ToInt32(obj["Age"]);
                    this.ClientId = Convert.ToInt32(obj["ClientId"]);
                    this.BookId = Convert.ToInt32(obj["BookId"]);
                    this.BookRate = Convert.ToInt32(obj["BookRate"]);
                    this.ContactNumber = Convert.ToInt32(obj["ContactNumber"]);
                    this.ClientName = obj["ClientName"].ToString();
                    //this.PurchaseDate = Convert.ToDateTime(obj["PurchaseDate"]);
                    this.PurchaseDate = obj["PurchaseDate"].ToString();
                    this.Email = obj["Email"].ToString();
                    this.Address = obj["Address"].ToString();
                    this.BookName = obj["BookName"].ToString();
                }
            }


            public int ClientId { get; set; }
            public string ClientName { get; set; }
            public int BookId { get; set; }
            public string BookName { get; set; }
            //public DateTime? PurchaseDate { get; set; }
            public string PurchaseDate { get; set; }
            public int BookRate { get; set; }
            public int ContactNumber { get; set; }
            public string Email { get; set; }
            public int Age { get; set; }
            public string Address { get; set; }
        }
        public class tblBookRateList
        {
            public tblBookRateList() { }
            public tblBookRateList(DataRow obj)
            {
                if (obj != null)
                {
                    this.BookId = Convert.ToInt32(obj["BookId"]);
                    this.BookName = obj["BookName"].ToString();
                    this.BookRate = Convert.ToInt32(obj["Rate"]);
                }
            }
            public int BookId { get; set; }
            public String BookName { get; set; }
            public int BookRate { get; set; }
        }
        public class searchModule
        {
            public string bookS { get; set; }
            public string bookSearch { get; set; }
            public string clientSearch { get; set; }
            public string dateSearch { get; set; }
        }
        
    }
}