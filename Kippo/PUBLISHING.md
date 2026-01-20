# Kippo NuGet Publishing Guide

This guide will help you publish the Kippo package to NuGet.org.

## Prerequisites

1. A NuGet.org account (create one at https://www.nuget.org)
2. An API key from NuGet.org (get one from https://www.nuget.org/account/apikeys)
3. .NET SDK installed

## Before Publishing

### 1. Update Package Metadata

Edit `Kippo.csproj` and update the following properties:

- `<Version>` - Increment the version number (e.g., 1.0.0, 1.0.1, 1.1.0)
- `<Authors>` - Add your name or organization
- `<Company>` - Add your company name (optional)
- `<PackageProjectUrl>` - Add your GitHub repository URL
- `<RepositoryUrl>` - Add your GitHub repository URL
- `<PackageReleaseNotes>` - Describe what's new in this version

### 2. Update README.md

Make sure the README.md reflects:
- Correct GitHub repository links
- Accurate installation instructions
- Current feature set

### 3. Test Locally

Before publishing, test the package locally:

```powershell
# Navigate to the Kippo project directory
cd d:\KippoGramm\Kippo

# Create the package
dotnet pack --configuration Release

# The .nupkg file will be in bin/Release/
```

Test the package in a local project:

```powershell
# Install from local package
dotnet add package Kippo --source "d:\KippoGramm\Kippo\bin\Release"
```

## Publishing to NuGet

### Option 1: Using .NET CLI (Recommended)

1. Build and pack your project:

```powershell
cd d:\KippoGramm\Kippo
dotnet pack --configuration Release
```

2. Push to NuGet.org:

```powershell
dotnet nuget push bin/Release/Kippo.1.0.0.nupkg --api-key YOUR_API_KEY --source https://api.nuget.org/v3/index.json
```

Replace `YOUR_API_KEY` with your actual NuGet API key.

### Option 2: Using NuGet.org Web Interface

1. Build the package:

```powershell
cd d:\KippoGramm\Kippo
dotnet pack --configuration Release
```

2. Go to https://www.nuget.org/packages/manage/upload

3. Upload the `.nupkg` file from `bin/Release/`

## After Publishing

1. The package will be available at: `https://www.nuget.org/packages/Kippo/`

2. It may take a few minutes for the package to be indexed and searchable

3. Update your GitHub repository README to include the NuGet badge:

```markdown
[![NuGet](https://img.shields.io/nuget/v/Kippo.svg)](https://www.nuget.org/packages/Kippo/)
```

## Version Updates

When releasing a new version:

1. Update the `<Version>` in Kippo.csproj
2. Update `<PackageReleaseNotes>` with changes
3. Commit and tag the release in git:

```powershell
git add .
git commit -m "Release v1.0.1"
git tag v1.0.1
git push origin main --tags
```

4. Build and publish the new version

## Versioning Guidelines

Follow [Semantic Versioning](https://semver.org/):

- **Major** (1.0.0 → 2.0.0): Breaking changes
- **Minor** (1.0.0 → 1.1.0): New features, backward compatible
- **Patch** (1.0.0 → 1.0.1): Bug fixes, backward compatible

## Troubleshooting

### Package Already Exists

Once a version is published to NuGet.org, it cannot be replaced. You must increment the version number.

### Package Validation Errors

Common issues:
- Missing required metadata (Authors, Description)
- Invalid license expression
- Missing README.md

### API Key Issues

Make sure your API key has the "Push" permission and hasn't expired.

## Resources

- [NuGet Documentation](https://docs.microsoft.com/en-us/nuget/)
- [Creating NuGet Packages](https://docs.microsoft.com/en-us/nuget/create-packages/creating-a-package)
- [Publishing to NuGet.org](https://docs.microsoft.com/en-us/nuget/nuget-org/publish-a-package)
