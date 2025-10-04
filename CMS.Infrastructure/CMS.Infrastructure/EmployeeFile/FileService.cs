using CMS.Application.EmployeeFile;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

public class FileService : IFileService
{
    private readonly string _basePath;

    public FileService(IConfiguration configuration)
    {
        _basePath = configuration["FileUploadBasePath"]
            ?? throw new ArgumentNullException(nameof(configuration), "FileUploadBasePath not configured.");
    }

    public async Task<string> SaveFileAsync(IFormFile file,string subFolder, string fileName, string remark)
    {
        var targetDir = Path.Combine(_basePath, subFolder);

        if (!Directory.Exists(targetDir))
            Directory.CreateDirectory(targetDir);

        var fullPath = Path.Combine(targetDir, fileName);

        using var stream = new FileStream(fullPath, FileMode.Create);
        await file.CopyToAsync(stream);

        return Path.Combine(subFolder, fileName).Replace("\\", "/"); 
    }

    public async Task<byte[]> ReadFileAsync(string relativePath)
    {
        var fullPath = Path.Combine(_basePath, relativePath);
        if (!File.Exists(fullPath))
            throw new FileNotFoundException("File not found.", fullPath);

        return await File.ReadAllBytesAsync(fullPath);
    }

    public async Task<bool> DeleteFileAsync(string relativePath)
    {
        var fullPath = Path.Combine(_basePath, relativePath);
        if (File.Exists(fullPath))
        {
            await Task.Run(() => File.Delete(fullPath));
            return true;
        }
        return false;
    }

    public async Task<string> UpdateFileAsync(IFormFile newFile, string oldRelativePath, string newFileName, string remark)
    {
        await DeleteFileAsync(oldRelativePath);

        var folder = Path.GetDirectoryName(oldRelativePath)?.Replace("\\", "/") ?? "";
        return await SaveFileAsync(newFile, folder, newFileName, remark);
    }
    public async Task DeleteFileAndContainingFolderAsync(string filePath)
    {
        var fullFilePath = Path.Combine(_basePath, filePath);

        if (File.Exists(fullFilePath))
        {
            File.Delete(fullFilePath);
        }

        var directory = Path.GetDirectoryName(fullFilePath);

        if (Directory.Exists(directory))
        {
            Directory.Delete(directory, recursive: true);
        }

        await Task.CompletedTask;
    }

}
