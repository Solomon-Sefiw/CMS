FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["CMS.Application/CMS.Application.csproj", "CMS.Application/"]
COPY ["CMS/CMS.Api.csproj", "CMS/"]
COPY ["CMS.Domain/CMS.Domain.csproj", "CMS.Domain/"]
COPY ["CMS.Infrastructure/CMS.Infrastructure/CMS.Infrastructure.csproj", "CMS.Infrastructure/"]
COPY ["CMS.Persistance/CMS.Persistance.csproj", "CMS.Persistance/"]

RUN dotnet restore "CMS/CMS.Api.csproj"
COPY . .

WORKDIR "/src/CMS"
RUN dotnet publish "CMS.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "CMS.Api.dll"]
