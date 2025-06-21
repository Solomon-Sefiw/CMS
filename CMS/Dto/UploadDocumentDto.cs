namespace CMS.Api.Dtos;

public record DocumentEndpointRootPath(string Path);
public record UploadDocumentDto(IFormFile File);
public record class DocumentMetadataDto(string Id);