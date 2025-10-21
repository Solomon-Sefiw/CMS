
using CMS.Domain;
using CMS.Domain.Acting;
using CMS.Domain.Adress;
using CMS.Domain.Appointments;
using CMS.Domain.Archive;
using CMS.Domain.Assignment;
using CMS.Domain.Benefit;
using CMS.Domain.BranchGrade;
using CMS.Domain.Cases;
using CMS.Domain.Cases.CaseDocument;
using CMS.Domain.Contacts;
using CMS.Domain.Courts;
using CMS.Domain.Benefit;
using CMS.Domain.BranchGrade;
using CMS.Domain.Contacts;
using CMS.Domain.Delegations;
using CMS.Domain.Document;
using CMS.Domain.Education;
using CMS.Domain.Education.awards;
using CMS.Domain.EmailTemplet;
using CMS.Domain.Employee;
using CMS.Domain.Employee.EmployeeActivities;
using CMS.Domain.EmployeeDocument;
using CMS.Domain.Hearings;
using CMS.Domain.Jobs;
using CMS.Domain.Judgments;
using CMS.Domain.Language;
using CMS.Domain.LetterDocument;
using CMS.Domain.letters;
using CMS.Domain.Notifications;
using CMS.Domain.Payments;
using CMS.Domain.Templates;
using CMS.Domain.Timelines;
using CMS.Domain.Employee.EmployeeActivities;
using CMS.Domain.EmployeeDocument;
using CMS.Domain.Jobs;
using CMS.Domain.Language;
using CMS.Domain.LetterDocument;
using CMS.Domain.letters;
using CMS.Domain.Transfer;
using CMS.Domain.User;
using CMS.Persistence;
using CMS.Services.DataService;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using SMS.Persistence.Interceptors;

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
           // modelBuilder.Entity<ChiefGroupRaw>().HasNoKey();
            modelBuilder.Entity<EmployeeFileDocument>()
           .HasOne(d => d.Employee)
           .WithMany(e => e.EmployeeFileDocuments)
           .HasForeignKey(d => d.EmployeeId)
           .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<EmployeeFileDocument>()
           .HasOne(e => e.Employee)
           .WithMany()
           .HasForeignKey(e => e.EmployeeId)
           .OnDelete(DeleteBehavior.Restrict); // Or Cascade

            modelBuilder.Entity<AuditEmployeeFileDocumentLog>()
                  .HasOne(a => a.Employee)
                  .WithMany()
                  .HasForeignKey(a => a.AffectedEmployeeId)
                  .OnDelete(DeleteBehavior.Cascade);

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

        /// <summary>
        /// Second
        /// </summary>

        public DbSet<Employee> Employees { get; set; }
        public DbSet<Acting> Actings { get; set; }
        public DbSet<Delegation> Delegations { get; set; }
        public DbSet<JobType> JobTypes { get; set; }
        public DbSet<Job> Jobs { get; set; }
        public DbSet<JobRole> JobRoles { get; set; }
        public DbSet<JobRoleCategory> JobRoleCatagories { get; set; }
        public DbSet<JobCatagory> JobCatagories { get; set; }
        public DbSet<JobGrade> JobGrades { get; set; }
        public DbSet<JobGradeStep> JobGradeSteps { get; set; }
        public DbSet<EmployeeDocument> EmployeeDocuments { get; set; }
        public DbSet<EmployeeComment> EmployeeComments { get; set; }
        public DbSet<EmployeeChangeLog> EmployeeChangeLogs { get; set; }
        public DbSet<Education> Educations { get; set; }
        public DbSet<Award> Awards { get; set; }
        public DbSet<EducationLevel> EducationLevels { get; set; }
        public DbSet<FieldOfStudy> FieldOfStudies { get; set; }
        public DbSet<InstitutionName> InstitutionNames { get; set; }
        public DbSet<LanguageSkill> LanguageSkills { get; set; }
        public DbSet<EmployeeEmergencyContact> EmployeeEmergencyContacts { get; set; }
        //
        public DbSet<EmployeeFamily> EmployeeFamilies { get; set; }
        public DbSet<EmployeeExperience> EmployeeExperiences { get; set; }
        public DbSet<EmployeeGuranters> EmployeeGuranteries { get; set; }
        public DbSet<BranchGrade> BranchGrades { get; set; }

        public DbSet<Benefit> Benefits { get; set; }
        public DbSet<BenefitUnitOfMeasurement> BenefitUnitOfMeasurements { get; set; }
        public DbSet<JobRoleBenefit> JobRoleBenefits { get; set; }
        public DbSet<BenefitValue> BenefitValues { get; set; }
        public DbSet<BenefitUnitPrice> BenefitUnitPrices { get; set; }
        public DbSet<JobGradeStepsValue> JobGradeStepsValues { get; set; }
        // Case

        public DbSet<Chilot> Chillots { get; set; }
        public DbSet<Case> Cases { get; set; }
       // public DbSet<CaseDocument> CaseDocuments { get; set; }
        public DbSet<CaseDocument> CaseDocuments { get; set; }
        public DbSet<Hearing> Hearings { get; set; }
        public DbSet<Judgment> Judgments { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<CaseTemplate> CaseTemplates { get; set; }
        public DbSet<CaseTimeline> CaseTimelines { get; set; }
        public DbSet<JudgeAssignment> JudgeAssignments { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<DocketEntry> DocketEntries { get; set; }
        public DbSet<Appointment> Appointments { get; set; }

        public DbSet<Reemployment> Reemployments { get; set; }
        public DbSet<Suspension> Suspensions { get; set; }
        public DbSet<Resignation> Resignations { get; set; }

        public DbSet<EmployeeWarning> EmployeeWarnings { get; set; }
        public DbSet<EmployeeTransfer> EmployeeTransfers { get; set; }
        public DbSet<EmployeeTransferSnapshot> EmployeeTransferSnapshots { get; set; }
        //Transaction  on it 
        public DbSet<EmployeePromotion> EmployeePromotions { get; set; }
        public DbSet<EmployeeDemotion> EmployeeDemotions { get; set; }
        public DbSet<EmployeeReClassification> EmployeeReClassifications { get; set; }
        public DbSet<EmployeeSalaryIncrement> EmployeeSalaryIncrements { get; set; }

        public DbSet<EmployeeFileDocument> EmployeeFileDocuments { get; set; }
        public DbSet<CaseFileDocument> CaseFileDocuments { get; set; }

        public DbSet<AuditEmployeeFileDocumentLog> AuditEmployeeFileDocumentLogs { get; set; }
        public DbSet<AuditCaseFileDocumentLog> AuditCaseFileDocumentLogs { get; set; }


        public DbSet<T> Set<T>() where T : class
        {
            return base.Set<T>();
        }
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