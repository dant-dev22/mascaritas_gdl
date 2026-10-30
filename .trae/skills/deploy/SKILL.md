---
name: deploy
description: Despliega el proyecto mascaritas_gdl al VPS de produccion (subida al servidor). Usala cuando el usuario diga deploy, hacer deploy, desplegar o publicar el sitio. No la uses para otros proyectos del VPS ni para cambios locales sin desplegar.
---

# Deploy de mascaritas_gdl

Publica este proyecto en el VPS de producción.

> **Estado: borrador.** Varios datos aún no existen porque el proyecto todavía no tiene
> repositorio remoto ni destino montado en el VPS. Están marcados como **POR DEFINIR**.
> No inventes valores: confírmalos con el usuario y actualiza esta skill antes de desplegar.

## Datos fijos (confirmados)

| Dato | Valor |
|---|---|
| Repo local | `c:\Users\dante\Documents\trae_projects\mascaritas_gdl` |
| VPS | `root@76.13.126.149` (hostname `srv1333724`), puerto 22 |
| Clave | `C:\Users\dante\.ssh\id_ed25519` (ya autorizada; no hace falta contraseña) |

## Datos POR DEFINIR (preguntar antes de desplegar)

| Dato | Valor |
|---|---|
| Remoto git | **POR DEFINIR** — aún no hay repo remoto (usuario de git conocido: `dant-dev22`) |
| Rama | **POR DEFINIR** (ldn usa `master`) |
| Ruta en el VPS | **POR DEFINIR** (ldn usa `/var/www/ldn`) |
| Proceso pm2 | **POR DEFINIR** |
| Puerto | **POR DEFINIR** (ldn usa 8090, bindeado a `127.0.0.1`) |
| Vhost nginx | **POR DEFINIR** |
| Dominio | **POR DEFINIR** |
| `.env.local` en el VPS | **POR DEFINIR** (ruta y permisos `600 root:root`) |

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

## Procedimiento

### 1. Verificar en local (bloquea el deploy si falla)

```
npx eslint src
npm run build
```

Ambos deben salir con código 0. Si el build falla, se corrige antes de seguir.

### 2. Publicar el código

Aún sin repo remoto definido. Cuando exista:

```
git add <archivos concretos>
git commit -m "<mensaje>"
git push
```

Añade solo los archivos del cambio; no metas `.env`, `.next/` ni artefactos locales. Un mensaje de una línea: PowerShell no acepta heredoc.

### 3. Construir y reiniciar en el VPS

Adapta la ruta y el nombre de pm2 cuando estén definidos:

```
ssh -o BatchMode=yes -o ConnectTimeout=20 root@76.13.126.149 "source /root/.nvm/nvm.sh; cd <RUTA VPS>; git pull; npm run build 2>&1 | tail -n 25; pm2 restart <PROCESO>; sleep 4; pm2 list"
```

Si el cambio toca `package.json` o el lockfile, añade `npm ci --no-audit --no-fund` entre `git pull` y `npm run build`.

### 4. Verificar el despliegue

1. Códigos de estado 200 en las rutas principales y en el dominio (`/`, `/catalogo`, `/producto/<slug>`, `/robots.txt`, `/sitemap.xml`).
2. `pm2`: el proceso de mascaritas en `online` y los procesos ajenos (`front-desaparecidos`, `react-ui-app`, `danger-ak`) sin reinicios.
3. Que no se rompió lo demás: `eldojo.tech`, `app.eldojo.tech`, `mi.eldojo.tech` y `admin.eldojo.tech` siguen en 200.

## Diagnóstico rápido

| Síntoma | Causa probable |
|---|---|
| `npm` o `pm2` no encontrado | Falta `source /root/.nvm/nvm.sh` en el comando remoto |
| `syntax error near unexpected token` | Comillas consumidas por PowerShell; simplifica el comando |
| El sitio arranca pero da 502 | El proceso pm2 no levantó; revisa `pm2 logs <PROCESO>` |
| Cambió `.env.local` y no surte efecto | Falta volver a construir; `pm2 restart` no reinyecta los `NEXT_PUBLIC_*` |
