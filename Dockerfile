FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src

# Copy project files (only those that exist)
COPY ["CMS.Application/CMS.Application.csproj", "CMS.Application/"]
COPY ["CMS.Api/CMS.Api.csproj", "CMS.Api/"]
COPY ["CMS.Domain/CMS.Domain.csproj", "CMS.Domain/"]
COPY ["CMS.Infrastructure/CMS.Infrastructure/CMS.Infrastructure.csproj", "CMS.Infrastructure/"]
COPY ["CMS.Persistance/CMS.Persistance.csproj", "CMS.Persistance/"]

# Disable SSL strict check by setting environment variable during restore
ENV DOTNET_SYSTEM_NET_HTTP_USESOCKETSHTTPHANDLER=0
ENV NUGET_SSL_VERIFY_CERTIFICATE=false
ENV DOTNET_CLI_TELEMETRY_OPTOUT=1

RUN dotnet restore "CMS/CMS.Api.csproj"

COPY . .

WORKDIR "/src/CMS"

RUN dotnet publish "CMS.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

WORKDIR /app
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "CMS.Api.dll"]
