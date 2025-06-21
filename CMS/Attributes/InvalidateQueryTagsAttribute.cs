namespace CMS.API.Attributes
{
    [AttributeUsage(AttributeTargets.Method, AllowMultiple = true)]
    public class InvalidateQueryTagsAttribute : Attribute
    {
        public string[] Tags { get; }

        public InvalidateQueryTagsAttribute(params string[] tags)
        {
            Tags = tags ?? Array.Empty<string>();
        }
    }
}