using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Service.ValueConverterService
{
    public class ValueConvertor:IValueConvertor
    {
        public Task<string> TwoDigitConvertorMethod(int value)
        {
            var twoDigit = value.ToString("D2");
            return Task.FromResult(twoDigit);
        }

        public Task<string> ThreeDigitConvertorMethod(int value)
        {
            var twoDigit = value.ToString("D3");
            return Task.FromResult(twoDigit);
        }
    }
  

}
