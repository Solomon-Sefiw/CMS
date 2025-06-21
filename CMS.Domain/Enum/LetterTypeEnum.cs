using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Domain.Enum
{
    public enum LetterType
    {
        Incoming = 1,
        Outgoing,
        InternalMemo
    }

    // Domain/Enums/LetterStatus.cs
    public enum LetterStatus
    {
        received = 1 ,
        pending,
        responded,
        archivedd
    }
    public enum CourtType
    {
        HighCourt = 1,
        SubordinateCourt,
        Other
    }
}
