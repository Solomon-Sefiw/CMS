namespace CMS.Application.Security;

public class AuthPolicy
{
    //Employee Related Policy

    //user Related Policy
    public static class User
    {
        public const string canViewUser = "canViewUser";
        public const string canCreateUpdateUser = "canCreateUpdateUser";
        public const string canDisableUser = "canDisableUser";
        public const string canEnableUser = "canEnableUser";
    }
    //SetUp Related Policy
    public static class Setup
    {
        public const string canViewSetup = "canViewSetup";
        public const string canCreateUpdateSetup = "canCreateUpdateSetup";
        public const string canApproveRejectSetup = "canApproveRejectSetup";
        public const string canSubmitSetup = "canSubmitSetup";
        public const string canActivateSetup = "canActivateSetup";
        public const string canDeactivateSetup = "canDeactivateSetup";
    }
    //SetUp Related Policy
    public static class AddressAndContact
    {
        public const string canViewAddressAndContact = "canViewAddressAndContact"; 
        public const string canCreateUpdateAddressAndContact = "canCreateUpdateAddressAndContact";
        public const string canActivateAddressAndContact = "canActivateAddressAndContact";
        public const string canDeactivateAddressAndContact = "canDeactivateAddressAndContact";
    }
    public static class Dashboard
    {
        public const string canViewLetterCountBoard = "canViewLetterCountBoard";
        public const string canViewRecentLettersBoard = "canViewRecentLettersBoard";
    }

}
