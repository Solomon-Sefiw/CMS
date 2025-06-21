// CMS.API.Configurations/RtkQueryTagOperationFilter.cs
using CMS.API.Attributes;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Reflection;
using System.Linq; // Add this using directive for .ToList() if not already there

namespace CMS.API.Configurations
{
    public class RtkQueryTagOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var invalidateAttributes = context.MethodInfo
                .GetCustomAttributes<InvalidateQueryTagsAttribute>(true)
                .ToList();

            // Tags from controller itself (fallback)
            var defaultTag = context.MethodInfo.DeclaringType?.Name?.Replace("Controller", "") ?? "";

            // All tags that should invalidate RTK Query cache
            var combinedTagsForInvalidation = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
            {
                defaultTag
            };

            foreach (var attr in invalidateAttributes)
            {
                foreach (var tag in attr.Tags)
                {
                    combinedTagsForInvalidation.Add(tag);
                }
            }

            if (combinedTagsForInvalidation.Count == 0)
            {
                // If no tags for invalidation, clear both custom extension and standard tags
                if (operation.Extensions.ContainsKey("x-rtk-query-invalidates"))
                {
                    operation.Extensions.Remove("x-rtk-query-invalidates");
                }
                operation.Tags.Clear(); // Ensure standard tags are also clear if no invalidation
                return;
            }

            // Populate the custom 'x-rtk-query-invalidates' extension (keeping this for completeness)
            var rtkQueryInvalidateTagArray = new OpenApiArray();
            foreach (var tag in combinedTagsForInvalidation)
            {
                rtkQueryInvalidateTagArray.Add(new OpenApiString(tag));
            }
            operation.Extensions["x-rtk-query-invalidates"] = rtkQueryInvalidateTagArray;


            // *** NEW / MODIFIED LOGIC HERE ***
            // Explicitly set the standard OpenAPI 'tags' property to include ALL desired invalidation tags.
            // This is the workaround to ensure rtk-query-codegen-openapi picks them up reliably.
            operation.Tags.Clear(); // Clear any existing standard tags first
            foreach (var tag in combinedTagsForInvalidation)
            {
                operation.Tags.Add(new OpenApiTag { Name = tag });
            }
            // *** END NEW / MODIFIED LOGIC ***
        }
    }
}

// FOR MAKE CUSTOM INVALIDATION ONLY TAKES "x-rtk-query-invalidates"

//using CMS.API.Attributes;
//using Microsoft.OpenApi.Any;
//using Microsoft.OpenApi.Models;
//using Swashbuckle.AspNetCore.SwaggerGen;
//using System.Reflection;

//namespace CMS.API.Configurations
//{
//    public class RtkQueryTagOperationFilter : IOperationFilter
//    {
//        public void Apply(OpenApiOperation operation, OperationFilterContext context)
//        {
//            var invalidateAttributes = context.MethodInfo
//                .GetCustomAttributes<InvalidateQueryTagsAttribute>(true)
//                .ToList();

//            // Tags from controller itself (fallback)
//            var defaultTag = context.MethodInfo.DeclaringType?.Name?.Replace("Controller", "") ?? "";

//            // All tags: [controllerTag, attributeTags...]
//            var combinedTags = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
//            {
//                defaultTag
//            };

//            foreach (var attr in invalidateAttributes)
//            {
//                foreach (var tag in attr.Tags)
//                {
//                    combinedTags.Add(tag);
//                }
//            }

//            if (combinedTags.Count == 0)
//                return;

//            var tagArray = new OpenApiArray();
//            foreach (var tag in combinedTags)
//            {
//                tagArray.Add(new OpenApiString(tag));
//            }

//            // This is the custom extension that rtk-query-codegen-openapi will look for
//            operation.Extensions["x-rtk-query-invalidates"] = tagArray;
//        }
//    }
//}