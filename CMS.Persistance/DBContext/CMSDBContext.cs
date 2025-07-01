
using CMS.Domain.EmailTemplet;
using CMS.Domain;
using CMS.Domain.User;
using CMS.Services.DataService;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using CMS.Domain.Document;
using CMS.Persistence;
using SMS.Persistence.Interceptors;
using Microsoft.EntityFrameworkCore.Storage;
using CMS.Domain.letters;
using CMS.Domain.Adress;
using CMS.Domain.Contacts;
using CMS.Domain.LetterDocument;

namespace CMS.Persistance.DBContext
{
    public class CMSDBContext : IdentityDbContext<HRUser, HRRole, string, IdentityUserClaim<string>, UserRole, IdentityUserLogin<string>, IdentityRoleClaim<string>, IdentityUserToken<string>>, IDataService
    {
        private readonly AuditableEntitySaveChangesInterceptor auditableEntitySaveChangesInterceptor;
        private readonly PublishDomainEventsInterceptor publishDomainEventsInterceptor;
        public CMSDBContext(DbContextOptions<CMSDBContext> options, 
            AuditableEntitySaveChangesInterceptor auditableEntitySaveChangesInterceptor,
            PublishDomainEventsInterceptor publishDomainEventsInterceptor) : base(options)
        {
            this.auditableEntitySaveChangesInterceptor = auditableEntitySaveChangesInterceptor;
            this.publishDomainEventsInterceptor = publishDomainEventsInterceptor;
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Ignore<List<IDomainEvent>>();
            modelBuilder.Ignore<IDomainEvent>();
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(CMSDBContext).Assembly);
            modelBuilder.HasSequence<int>("EmployeeId");
        }


        public DbSet<BusinessUnit> BusinessUnits { get; set; }
        public DbSet<BusinessUnitType> BusinessUnitTypes { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<Region> Regions { get; set; }
        public DbSet<SubCity> SubCities { get; set; }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<EmailTemplate> EmailTemplates { get; set; }
        public DbSet<UserDocument> UserDocuments { get; set; }
        public DbSet<Document> Documents { get; set; }
        public DbSet<Email> Emails { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<HRRole> Roles { get; set; }
        public DbSet<Letter> Letters { get; set; }
        public DbSet<LetterDocument> LetterDocuments { get; set; }
        //EmployeeGurantors
        public void Save()
        {
            this.SaveChanges();
        }

        public async Task SaveAsync(CancellationToken cancellationToken)
        {
            await SaveChangesAsync(cancellationToken);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.AddInterceptors(publishDomainEventsInterceptor, auditableEntitySaveChangesInterceptor);

            base.OnConfiguring(optionsBuilder);
        }
        //adding Transaction on it 

        public async Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken)
        {
            return await Database.BeginTransactionAsync(cancellationToken);
        }

        // Commit the transaction
        public async Task CommitTransactionAsync(IDbContextTransaction transaction, CancellationToken cancellationToken)
        {
            await transaction.CommitAsync(cancellationToken);
        }

        // Rollback the transaction
        public async Task RollbackTransactionAsync(IDbContextTransaction transaction, CancellationToken cancellationToken)
        {
            await transaction.RollbackAsync(cancellationToken);
        }

        //Adding on the Way of it
    }

}