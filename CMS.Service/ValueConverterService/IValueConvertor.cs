using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Service.ValueConverterService
{
    public interface IValueConvertor
    {
        Task<string> TwoDigitConvertorMethod(int value);
        Task<string> ThreeDigitConvertorMethod(int value);
    }
}
