namespace CMS.Api.Dtos;

public record DocumentEndpointRootPath(string Path);
public record UploadDocumentDto(IFormFile file);
public record class DocumentMetadataDto(string Id);