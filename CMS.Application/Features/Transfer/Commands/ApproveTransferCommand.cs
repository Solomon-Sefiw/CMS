using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Transfer.Commands
{
    public record ApproveTransferCommand(int Id, string Comment) : IRequest<bool>;
}
