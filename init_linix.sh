```bash
#!/bin/bash

echo "Iniciando frontend..."
(cd unioff-frontend && npm run dev) &

echo "Iniciando backend..."
(cd unioff-backend && ./mvnw spring-boot:run) &

echo "Aplicação iniciada!"
```
