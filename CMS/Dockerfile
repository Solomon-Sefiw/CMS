# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files with corrected paths
COPY ["src/Application/CMS.Application.csproj", "src/Application/"]
COPY ["src/API/CMS.Api.csproj", "src/API/"]
COPY ["src/Domain/CMS.Domain.csproj", "src/Domain/"]
COPY ["src/Infrastructure/CMS.Infrastructure.csproj", "src/Infrastructure/"]
COPY ["src/Persistence/CMS.Persistence.csproj", "src/Persistence/"]
COPY ["src/CommonServices/CMS.Services.csproj", "src/CommonServices/"]

# Restore
RUN dotnet restore "src/API/CMS.Api.csproj"

# Copy everything
COPY . .

# Set working directory and publish
WORKDIR "/src/src/API"
RUN dotnet publish "CMS.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "CMS.Api.dll"]
