using CMS.Domain.Enum;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Transfer.Commands
{
    public record UpdateTransferCommand(
           int Id,
           int EmployeeId,
           int ToBusinessUnitId,
           int ToJobRoleId,
           LateralTransferType TransferType,
           DateOnly TransferDate,
           string? TransferReason
    ) : IRequest<bool>;


}
