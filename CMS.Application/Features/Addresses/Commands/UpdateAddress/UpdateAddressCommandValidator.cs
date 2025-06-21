using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;
using CMS.Domain.Enum;
using CMS.Services.DataService;

namespace CMS.Application.Features.Addresses.Commands.UpdateAddress
{
    public class UpdateAddressCommandValidator : AbstractValidator<UpdateAddressCommand>
    {
        private readonly IDataService dataService;

        public UpdateAddressCommandValidator(IDataService dataService)
        {
            this.dataService = dataService;

            RuleFor(x => x.AddressType)
                .IsInEnum()
                .WithMessage("Address Type is Required");

            // Common field: Country must be specified
            RuleFor(address => address.Country)
                .IsInEnum()
                .WithMessage("Country must be a valid value.");

            // Woreda is required for all addresses
            RuleFor(address => address.Woreda)
                .NotEmpty()
                .WithMessage("Woreda is required.");   
            // Woreda is required for all addresses
            RuleFor(address => address.City)
                .NotEmpty()
                .WithMessage("City is required.");

            // Conditional validation based on AddressType
            RuleFor(address => address.RegionId)
                .NotEmpty()
                .WithMessage("Region Or City Admin is required !");


            RuleFor(address => address.SubCityId)
                .NotEmpty()
                .WithMessage("SubCity Or Zone is required !");


            // Optional field: Kebele, no rules needed unless specified
            RuleFor(address => address.Kebele)
                .MaximumLength(50)
                .WithMessage("Kebele must be less than 50 characters.");
            // Optional field: HouseNumber, no rules needed unless specified
            RuleFor(address => address.HouseNumber)
                .MaximumLength(50)
                .WithMessage("House Number must be less than 50 characters.");


        }
    }
}
