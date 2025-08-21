using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Application.EmployeeFile
{
    public interface IFileService
    {
        Task<string> SaveFileAsync(IFormFile file,string subfolder, string fileName,string remark);
        Task<byte[]> ReadFileAsync(string filePath);
        Task<bool> DeleteFileAsync(string filePath);
        Task<string> UpdateFileAsync(IFormFile newFile, string oldRelativePath, string newFileName,string remark);
        Task DeleteFileAndContainingFolderAsync(string filePath);
    }
}
