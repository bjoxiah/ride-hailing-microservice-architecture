# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj and restore with force
COPY *.csproj ./
RUN dotnet nuget locals all --clear
RUN dotnet restore --no-cache

# Copy everything else and publish
COPY . ./
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# Copy publish output
COPY --from=build /app/publish ./

# Expose container port
EXPOSE 8088

# Bind Kestrel to all network interfaces
ENV ASPNETCORE_URLS=http://+:8088

ENTRYPOINT ["dotnet", "vehicle-service.dll"]