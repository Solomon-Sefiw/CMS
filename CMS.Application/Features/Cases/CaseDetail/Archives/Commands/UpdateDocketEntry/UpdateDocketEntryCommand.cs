using AutoMapper;
using CMS.Services.DataService;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseDetail.Archives.Commands.UpdateDocketEntry
{
    public class UpdateDocketEntryCommand : IRequest<bool>
    {
        public int Id { get; set; }
        public string DocketNumber { get; set; } = string.Empty;
        public int CaseId { get; set; }
        public string? StoragePath { get; set; }
        public string? ArchivedBy { get; set; }
    }

    public class UpdateDocketEntryCommandHandler : IRequestHandler<UpdateDocketEntryCommand, bool>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;

        public UpdateDocketEntryCommandHandler(IDataService dataService, IMapper mapper)
        {
            _dataService = dataService;
            _mapper = mapper;
        }

        public async Task<bool> Handle(UpdateDocketEntryCommand request, CancellationToken cancellationToken)
        {
            var entity = await _dataService.DocketEntries
                .FirstOrDefaultAsync(d => d.Id == request.Id, cancellationToken);

            if (entity == null) return false;

            _mapper.Map(request, entity);

            _dataService.DocketEntries.Update(entity);
            await _dataService.SaveAsync(cancellationToken);

            return true;
        }
    }
}
