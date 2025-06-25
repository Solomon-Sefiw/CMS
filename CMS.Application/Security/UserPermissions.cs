namespace CMS.Application.Security;

public class UserPermissions
{
    public static class User
    {
        public const string View = "canViewUser";
        public const string Edit = "canCreateUpdateUser";
        public const string Disable = "canDisableUser";
        public const string Enable = "canEnableUser";

    }

    public static class Setup   
    {
        public const string View = "canViewSetup";
        public const string Edit = "canCreateUpdateSetup";
        public const string Approve = "canApproveRejectSetup";
        public const string Submit = "canSubmitSetup";
        public const string Activate = "canActivateSetup";
        public const string Deactivate = "canDeactivateSetup";

    }
    public static class AddressAndContact
    {
        public const string View = "canViewAddressAndContact";
        public const string Edit = "canCreateUpdateAddressAndContact";
        public const string Activate = "canActivateAddressAndContact";
        public const string Deactivate = "canDeactivateAddressAndContact";
    }
    public static class Dashboard
    {
        // Cards
        public const string View = "canViewLetterCountBoard";
        public const string View1 = "canViewRecentLettersBoard";
    }





}
