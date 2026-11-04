---
name: deploy
description: Despliega el proyecto mascaritas_gdl al VPS de produccion (subida al servidor). Usala cuando el usuario diga deploy, hacer deploy, desplegar o publicar el sitio. No la uses para otros proyectos del VPS ni para cambios locales sin desplegar.
---

# Deploy de mascaritas_gdl

Publica este proyecto en el VPS de producción.

> **Estado: desplegado y en producción.** Todos los datos están definidos y verificados.
> El sitio vive en `https://mascaritasgdl.com` (HTTPS con Let's Encrypt, redirección 301 desde HTTP).

## Datos fijos (confirmados)

| Dato | Valor |
|---|---|
| Repo local | `c:\Users\dante\Documents\trae_projects\mascaritas_gdl` |
| Repo remoto (frontend) | `git@github.com:dant-dev22/mascaritas_gdl.git` — rama `master` |
| Repo remoto (backend) | `git@github.com:dant-dev22/mascaritas_gdl-api.git` — rama `master` |
| VPS | `root@76.13.126.149` (hostname `srv1333724`), puerto 22 |
| Clave | `C:\Users\dante\.ssh\id_ed25519` (ya autorizada; no hace falta contraseña) |
| Ruta frontend en VPS | `/var/www/mascaritas_gdl` |
| Ruta backend en VPS | `/var/www/mascaritas_gdl-api` |
| Proceso pm2 | `mascaritas-gdl` (frontend), `mascaritas-gdl-api` (backend) |
| Puerto frontend | `18080` (`next start` bindeado a `127.0.0.1`; llega al público vía nginx) |
| Puerto backend | `18081` (bindeado a `127.0.0.1`) |
| Base de datos | `mascaritas_db` en el MySQL nativo del VPS (`127.0.0.1:3306`), usuario `mascaritas`@`127.0.0.1` |
| Contraseña de la BD | rotada en cada despliegue y guardada en `/root/.mascaritas-db-pass` (`chmod 600`) |
| `.env.local` frontend | `/var/www/mascaritas_gdl/.env.local` (`BACKEND_URL=http://127.0.0.1:18081`, `chmod 600 root:root`) |
| `.env` backend | `/var/www/mascaritas_gdl-api/.env` (`chmod 600 root:root`) |
| Vhost nginx | `/etc/nginx/sites-available/mascaritas_gdl` → symlink en `sites-enabled/`, `server_name mascaritasgdl.com www.mascaritasgdl.com`, proxy a `127.0.0.1:18080` |
| Dominio | `mascaritasgdl.com` y `www.mascaritasgdl.com` (A → `76.13.126.149`) |
| HTTPS (certbot) | Let's Encrypt, `/etc/letsencrypt/live/mascaritasgdl.com/`, emitido con `certbot --nginx --redirect --keep-until-expiring`; renovación automática |

Plantilla de conexión. Pon el comando remoto entre comillas **dobles** y usa comillas **simples** para lo que va dentro:

```
ssh -o BatchMode=yes -o ConnectTimeout=20 root@76.13.126.149 "<comando remoto>"
```

## Reglas de entorno que hay que respetar

- **Node, npm y pm2 viven en nvm.** Todo comando remoto que los use debe empezar con `source /root/.nvm/nvm.sh`. Sin eso falla con `npm: command not found` o `pm2: command not found`.
- **El build se hace en el VPS, nunca en Windows.** El `.next` local trae binarios nativos (SWC, sharp) para otra plataforma y el proceso arranca roto.
- **Las variables `NEXT_PUBLIC_*` se hornean en tiempo de build.** Si cambia `.env.local`, hay que volver a construir; reiniciar pm2 no basta.
- **Este shell es PowerShell 5.** No soporta heredoc (`<<`) y se come las comillas anidadas: evita patrones de `grep` con paréntesis o barras dentro de comillas, y escribe un `grep` por término en vez de usar `-E` con alternancia.
- **No toques los vhosts de eldojo ni los listeners 80/443.** Los pm2 `front-desaparecidos` (4173), `react-ui-app` (3000) y `danger-ak` (3020) y la API uvicorn (8000) no son parte de este proyecto.
- **No toques `/var/www/ldn` ni `/var/www/liberenalos7`.** Son otros proyectos del mismo VPS.
- **UFW está activo con política DROP por defecto.** Solo están abiertos 22, 80, 443, 8082, 8090 y 48174. El frontend (18080) y el backend (18081) están bindeados a `127.0.0.1` y se accede a ellos por nginx (80/443); **no hay que abrir ningún puerto nuevo**.
- **El backend arranca con pm2 y `--interpreter none`.** Sin eso pm2 ejecuta `.venv/bin/uvicorn` con Node y revienta con `SyntaxError: Unexpected identifier 'uvicorn'` en bucle de reinicios:
  ```
  pm2 start /var/www/mascaritas_gdl-api/.venv/bin/uvicorn --name mascaritas-gdl-api --interpreter none --cwd /var/www/mascaritas_gdl-api -- app.main:app --host 127.0.0.1 --port 18081 --proxy-headers --forwarded-allow-ips 127.0.0.1
  ```
- **MySQL del VPS tiene `validate_password` (policy MEDIUM).** Exige ≥8 caracteres con minúscula, mayúscula, dígito y **carácter especial**. Una contraseña de `openssl rand` pelada falla; se compone con un prefijo y sufijo fijos, p. ej. `DB_PASS="Mg$(openssl rand -hex 14)!A9"`. El charset resultante (`A-Za-z0-9!-`) es seguro para el heredoc de SQL y para la URL de `DATABASE_URL`.

## Procedimiento

### 1. Verificar en local (bloquea el deploy si falla)

```
npx eslint src
npm run build
```

Ambos deben salir con código 0. Si el build falla, se corrige antes de seguir.

### 2. Publicar el código

```
git add <archivos concretos>
git commit -m "<mensaje>"
git push origin master
```

Añade solo los archivos del cambio; no metas `.env`, `.next/` ni artefactos locales. Un mensaje de una línea: PowerShell no acepta heredoc.

### 3. Construir y reiniciar en el VPS

Frontend (si cambió `package.json` o el lockfile, añade `npm ci --no-audit --no-fund` después de `git pull`):

```
ssh -o BatchMode=yes -o ConnectTimeout=20 root@76.13.126.149 "source /root/.nvm/nvm.sh; cd /var/www/mascaritas_gdl; git pull; npm run build 2>&1 | tail -n 25; pm2 restart mascaritas-gdl; sleep 4; pm2 list"
```

Backend (recrea el venv solo si cambió `requirements.txt`):

```
ssh -o BatchMode=yes -o ConnectTimeout=20 root@76.13.126.149 "source /root/.nvm/nvm.sh; cd /var/www/mascaritas_gdl-api; git pull; ./.venv/bin/pip install -r requirements.txt; pm2 restart mascaritas-gdl-api; sleep 4; pm2 list"
```

### 4. Verificar el despliegue

1. Códigos de estado 200 en `https://mascaritasgdl.com/`, `/catalogo`, `/producto/<slug>` y en el proxy `/api/productos`. (`robots.txt` y `sitemap.xml` todavía no existen: dan 404.)
2. `pm2`: `mascaritas-gdl` y `mascaritas-gdl-api` en `online`, y los procesos ajenos (`front-desaparecidos`, `react-ui-app`, `danger-ak`, `ldn-api`) sin reinicios.
3. Que no se rompió lo demás: `eldojo.tech` y `app.eldojo.tech` siguen en 200.

## Diagnóstico rápido

| Síntoma | Causa probable |
|---|---|
| `npm` o `pm2` no encontrado | Falta `source /root/.nvm/nvm.sh` en el comando remoto |
| `syntax error near unexpected token` | Comillas consumidas por PowerShell; simplifica el comando |
| El sitio arranca pero da 502 | El proceso pm2 no levantó; revisa `pm2 logs <PROCESO>` |
| `SyntaxError: Unexpected identifier 'uvicorn'` y el API en bucle `errored` | Falta `--interpreter none` en el `pm2 start` del backend |
| `ERROR 1819 ... does not satisfy the current policy` al crear el usuario MySQL | La contraseña no cumple `validate_password` MEDIUM (le falta carácter especial) |
| Cambió `.env.local` y no surte efecto | Falta volver a construir; `pm2 restart` no reinyecta los `NEXT_PUBLIC_*` |
