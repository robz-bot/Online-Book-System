using Book_System.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using static Book_System.Models.BookBo;

namespace Book_System.Controllers
{
    public class BookController : Controller
    {
        // GET: Book
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult getBookList()
        {
            string msg = string.Empty;
            Result res = new Result();
            try
            {
                BookBLL BLL = new BookBLL();
                res.Item = BLL.getBookList();
                res.isSuccess = res.Item != null ? true : false;
                res.Message = res.isSuccess == true ? "Success" : "Error while fetching the list";
            }
            catch (Exception ex)
            {
                msg = ex + "Failed";
            }
            return Json(res);
        }
        public ActionResult getclientList()
        {
            string msg = string.Empty;
            Result res = new Result();
            try
            {
                BookBLL BLL = new BookBLL();
                res.Item = BLL.getclientList();
                res.isSuccess = res.Item != null ? true : false;
                res.Message = res.isSuccess == true ? "Success" : "Error while fetching the list";
            }
            catch (Exception ex)
            {
                msg = ex + "Failed";
            }
            return Json(res);
        }   
        public ActionResult getclientListBySearch(searchModuleForClient searchClient)
        {
            string msg = string.Empty;
            Result res = new Result();
            try
            {
                BookBLL BLL = new BookBLL();
                res.Item = BLL.getclientListBySearch(searchClient);
                res.isSuccess = res.Item != null ? true : false;
                res.Message = res.isSuccess == true ? "Success" : "Error while fetching the list";
            }
            catch (Exception ex)
            {
                msg = ex + "Failed";
            }
            return Json(res);
        }
        public ActionResult getBookRateList()
        {
            string msg = string.Empty;
            Result res = new Result();
            try
            {
                BookBLL BLL = new BookBLL();
                res.Item = BLL.getBookRateList();
                res.isSuccess = res.Item != null ? true : false;
                res.Message = res.isSuccess == true ? "Success" : "Error while fetching the list";
            }
            catch (Exception ex)
            {
                msg = ex + "Failed";
            }
            return Json(res);
        }
        public ActionResult getBookRateListBySearch(searchModuleForBook searchBook)
        {
            string msg = string.Empty;
            Result res = new Result();
            try
            {
                BookBLL BLL = new BookBLL();
                res.Item = BLL.getBookRateListBySearch(searchBook);
                res.isSuccess = (res.Item != null) ? true : false;
                res.Message = res.isSuccess == true ? "Success" : "Error while fetching the list";
            }
            catch (Exception ex)
            {
                msg = ex + "Failed";
            }
            return Json(res);
        }
        public ActionResult saveClientDetails(tblClientDetails tblClientDetails)
        {
            Result result = new Result();
            try
            {
                BookBLL bookBLL = new BookBLL();
                result.Item = bookBLL.saveClientDetails(tblClientDetails);
                result.isSuccess = result.Item != null ? true : false;
                result.Message = result.isSuccess == true ? "Success" : "Error while adding the client";
            }
            catch (Exception e)
            {

            }
            return Json(result);
        }
    }
}
