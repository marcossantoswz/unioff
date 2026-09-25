```bat
@echo off

echo Iniciando frontend...
start cmd /k "cd unioff-frontend && npm run dev"

echo Iniciando backend...
start cmd /k "cd unioff-backend && .\mvnw spring-boot:run"

echo Aplicacao iniciada!
```
