using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using static Book_System.Models.BookBo;
//< connectionStrings >
//	< add name = "Student"
// connectionString = "Server=S-ID-056;Database=StudentManagement;uid=sa;password=admin@2018;"
// providerName = "System.Data.SqlClient" />
//</ connectionStrings >
namespace Book_System.Models
{
    public class BookBLL
    {
        SqlConnection sqlConnection = new SqlConnection
            (ConfigurationManager.ConnectionStrings["Book"].ConnectionString);

        public List<tblBooks> getBookList()
        {
            List<tblBooks> tblBooks = new List<tblBooks>();
            try
            {
                DataTable dt = new DataTable();
                SqlCommand sqlCommand = new SqlCommand("dbo.USP_BookList", sqlConnection);
                sqlCommand.CommandType = CommandType.StoredProcedure;
                sqlConnection.Open();

                SqlDataAdapter sqlDataAdapter = new SqlDataAdapter(sqlCommand);
                sqlDataAdapter.Fill(dt);

                tblBooks = dt.AsEnumerable().Select(obj => new tblBooks(obj)).ToList();
                sqlConnection.Close();
            }
            catch (Exception e)
            {

            }
            return tblBooks;
        }
        public List<tblBookRateList> getBookRateListBySearch(string searchBook)
        {
            List<tblBookRateList> tblBookRateLists = new List<tblBookRateList>();
            try
            {
                DataTable dt = new DataTable();
                SqlCommand sqlCommand = new SqlCommand("dbo.USP_BookRateTable", sqlConnection);
                sqlCommand.CommandType = CommandType.StoredProcedure;
                sqlCommand.Parameters.AddWithValue("@searchBook", searchBook);
                sqlConnection.Open();

                SqlDataAdapter sqlDataAdapter = new SqlDataAdapter(sqlCommand);
                sqlDataAdapter.Fill(dt);

                tblBookRateLists = dt.AsEnumerable().Select(obj => new tblBookRateList(obj)).ToList();
                sqlConnection.Close();
            }
            catch (Exception e)
            {

            }
            return tblBookRateLists;
        }
        public List<tblBookRateList> getBookRateList()
        {
            List<tblBookRateList> tblBookRateLists = new List<tblBookRateList>();
            try
            {
                DataTable dt = new DataTable();
                SqlCommand sqlCommand = new SqlCommand("dbo.USP_BookRateTable", sqlConnection);
                sqlCommand.CommandType = CommandType.StoredProcedure;
                sqlConnection.Open();

                SqlDataAdapter sqlDataAdapter = new SqlDataAdapter(sqlCommand);
                sqlDataAdapter.Fill(dt);

                tblBookRateLists = dt.AsEnumerable().Select(obj => new tblBookRateList(obj)).ToList();
                sqlConnection.Close();
            }
            catch (Exception e)
            {

            }
            return tblBookRateLists;
        }
        public int saveClientDetails(tblClientDetails tblClientDetails)
        {
            int a = 0;
            try
            {
                SqlCommand sqlCommand = new SqlCommand("dbo.USP_AddClientDetail", sqlConnection);
                sqlCommand.CommandType = CommandType.StoredProcedure;
                sqlCommand.Parameters.AddWithValue("@ClientId", tblClientDetails.ClientId);
                sqlCommand.Parameters.AddWithValue("@ClientName", tblClientDetails.ClientName);
                sqlCommand.Parameters.AddWithValue("@ContactNumber", tblClientDetails.ContactNumber);
                sqlCommand.Parameters.AddWithValue("@Age", tblClientDetails.Age);
                sqlCommand.Parameters.AddWithValue("@Address", tblClientDetails.Address);
                sqlCommand.Parameters.AddWithValue("@BookId", tblClientDetails.BookId);
                sqlCommand.Parameters.AddWithValue("@BookRate", tblClientDetails.BookRate);
                sqlCommand.Parameters.AddWithValue("@Email", tblClientDetails.Email);
                sqlCommand.Parameters.AddWithValue("@PurchaseDate", tblClientDetails.PurchaseDate);
                sqlConnection.Open();
                a = sqlCommand.ExecuteNonQuery();
                sqlConnection.Close();
            }
            catch (Exception ex)
            {

            }
            return a;
        }
    }
}