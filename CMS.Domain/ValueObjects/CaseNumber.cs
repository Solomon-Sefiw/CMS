using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace CMS.Domain.ValueObjects
{
    public sealed class CaseNumber
    {
        private static readonly Regex ValidPattern = new(@"^[0-9]{4}\/[A-Z0-9\-]+\/[0-9]{4,}$", RegexOptions.Compiled);
        public string Value { get; }
        private CaseNumber(string value) => Value = value;
        public static CaseNumber Create(string year, string courtCode, int sequence) => new($"{year}/{courtCode}/{sequence:D4}");
        public static bool IsValid(string s) => ValidPattern.IsMatch(s);
    }
}
