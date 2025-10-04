using AutoMapper;
using CMS.Domain.Archive;
using CMS.Services.DataService;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.Features.Cases.CaseDetail.Archives.Commands.CreateDocketEntry
{
    public class CreateDocketEntryCommand : IRequest<int>
    {
        public string DocketNumber { get; set; } = string.Empty;
        public int CaseId { get; set; }
        public string? StoragePath { get; set; }
        public string? ArchivedBy { get; set; }
    }

    public class CreateDocketEntryCommandHandler : IRequestHandler<CreateDocketEntryCommand, int>
    {
        private readonly IDataService _dataService;
        private readonly IMapper _mapper;

        public CreateDocketEntryCommandHandler(IDataService dataService, IMapper mapper)
        {
            _dataService = dataService;
            _mapper = mapper;
        }

        public async Task<int> Handle(CreateDocketEntryCommand request, CancellationToken cancellationToken)
        {
            var entity = _mapper.Map<DocketEntry>(request);
            entity.ArchivedAt = DateTime.UtcNow;

            await _dataService.DocketEntries.AddAsync(entity, cancellationToken);
            await _dataService.SaveAsync(cancellationToken);

            return entity.Id;
        }
    }
}
