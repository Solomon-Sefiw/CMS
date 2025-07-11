FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /CMS

# ✅ Updated paths based on your actual folder structure
COPY ["CMS/Application/CMS.Application.csproj", "src/Application/"]
COPY ["CMS/API/CMS.Api.csproj", "src/API/"]
COPY ["CMS/Domain/CMS.Domain.csproj", "src/Domain/"]
COPY ["CMS/Infrastructure/CMS.Infrastructure.csproj", "src/Infrastructure/"]
COPY ["CMS/Persistence/CMS.Persistence.csproj", "src/Persistence/"]

RUN dotnet restore "CMS/API/CMS.Api.csproj"

COPY . .

WORKDIR "/CMS/API"
RUN dotnet publish "CMS.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "CMS.Api.dll"]
