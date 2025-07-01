
using CMS.Domain;
using CMS.Domain.Document;
using CMS.Domain.EmailTemplet;
using CMS.Domain.letters;
using CMS.Domain.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using CMS.Domain.Adress;
using CMS.Domain.Contacts;
using CMS.Domain.LetterDocument;

namespace CMS.Services.DataService
{
    public interface IDataService
    {
        public DbSet<BusinessUnit> BusinessUnits { get; set; }
        public DbSet<BusinessUnitType> BusinessUnitTypes { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<Region> Regions { get; set; }
        public DbSet<SubCity> SubCities { get; set; }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<EmailTemplate> EmailTemplates { get; set; }
        public DbSet<Document> Documents { get; set; }
        public DbSet<UserDocument> UserDocuments { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<HRRole> Roles { get; set; }
        public DbSet<Email> Emails { get; set; }
        public DbSet<Letter> Letters { get; set; }
        public DbSet<LetterDocument> LetterDocuments { get; set; }


        //EmployeeExperiences
        void Save();
        Task SaveAsync(CancellationToken cancellationToken);
        //
        Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken);
        Task CommitTransactionAsync(IDbContextTransaction transaction, CancellationToken cancellationToken);
        Task RollbackTransactionAsync(IDbContextTransaction transaction, CancellationToken cancellationToken);

        //
    }
}
