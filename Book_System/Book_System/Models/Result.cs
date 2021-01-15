using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Book_System.Models
{
    public class Result
    {
        public object Item { get; set; }
        public string Message { get; set; }
        public bool isSuccess { get; set; }
    }
}