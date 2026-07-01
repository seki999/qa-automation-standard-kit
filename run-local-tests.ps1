param(
    [switch]$SkipE2E
)

$ErrorActionPreference = "Stop"

Push-Location backend
mvn test
Pop-Location

Push-Location frontend
npm install
npm run build
Pop-Location

if (-not $SkipE2E) {
    Write-Host "Start backend/frontend in separate terminals before running Karate and E2E tests:"
    Write-Host "  cd backend; mvn spring-boot:run"
    Write-Host "  cd frontend; npm run dev"
    Push-Location tests\karate
    mvn test -DbaseUrl=http://localhost:8080
    Pop-Location
    Push-Location tests\playwright
    npm install
    npx playwright install chromium
    npm test
    Pop-Location
}
