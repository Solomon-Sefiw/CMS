FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# ✅ Updated paths based on your actual folder structure
COPY ["src/Application/CMS.Application.csproj", "src/Application/"]
COPY ["src/API/CMS.Api.csproj", "src/API/"]
COPY ["src/Domain/CMS.Domain.csproj", "src/Domain/"]
COPY ["src/Infrastructure/CMS.Infrastructure.csproj", "src/Infrastructure/"]
COPY ["src/Persistence/CMS.Persistence.csproj", "src/Persistence/"]

RUN dotnet restore "src/API/CMS.Api.csproj"

COPY . .

WORKDIR "/src/API"
RUN dotnet publish "CMS.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "CMS.Api.dll"]
