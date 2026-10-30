---
name: git-guardian
description: Audit repo state before and after every git operation, keep local and remote in sync, and warn about risky states. Use when the user commits, pushes, pulls, merges, rebases, branches, stashes, or mentions git. Do not use for non-git tasks.
---

# Git Guardian

Actúa como experto en Git para el repositorio actual. Antes y después de **cualquier** operación de Git: inspecciona el estado real, advierte de riesgos y deja el repo en sincronía. Nunca asumas el estado — verifícalo con comandos.

## Protocolo

### 1. Antes de tocar nada (obligatorio)

Ejecuta en paralelo y lee la salida completa:

```bash
git status --short --branch
git branch -vv
git log --oneline -5
git stash list
git remote -v
```

Con eso determina: rama actual, upstream y si falta, ahead/behind, ficheros modificados/untracked, operación a medias (rebase, merge, cherry-pick, revert, bisect), stashes pendientes.

Si `git status` reporta conflicto, rebase o merge en curso, **detente** y resuélvelo o pregunta antes de cualquier otro comando.

### 2. Semáforo de advertencias

Clasifica lo encontrado y repórtalo antes de continuar:

| Nivel | Situación | Acción |
|-------|-----------|--------|
| Alto | `HEAD detached`, rebase/merge/cherry-pick sin terminar, conflictos sin resolver, `.gitignore` roto o `.env`/credenciales trackeados | Detener y avisar; no ejecutar nada más sin instrucción |
| Alto | `behind` y `ahead` a la vez (divergencia), upstream inexistente, rama borrada en remoto | Proponer `git pull --rebase` o `git push -u origin <rama>`; preguntar ante divergencia |
| Medio | Solo `behind`, stash antiguo sin usar, rama muy desviada de `main`, cambios sin commitear que mezclan temas distintos | Proponer rebase/pull, sugerir separar commits |
| Medio | `package-lock.json` desincronizado con `package.json`, ficheros generados sin commitear | Verificar con `npm ci --dry-run` o build antes de commitear |
| Bajo | Untracked esperados (`dist/`, `node_modules/`, cachés), rama local sin tracking propuesto | Ignorar o añadir a `.gitignore` si procede |

Revisa también: ficheros grandes o binarios añadidos, cambios de finales de línea (CRLF), permisos `100644`/`100755` alterados, y `AGENTS.md` (lo regenera `next dev`; commitearlo junto al trabajo mantiene el árbol limpio).

### 3. Reglas de seguridad (no negociables)

- No hacer `commit`, `push`, `amend`, `reset --hard`, `clean`, `rebase` ni `branch -D` sin que el usuario lo pida explícitamente.
- Nunca `push --force` / `--force-with-lease` salvo petición explícita; nunca a `main`/`master` sin avisar.
- Añadir ficheros por nombre (`git add <ruta>`), nunca `git add -A` / `git add .`; nunca `-uall`.
- Nunca commitear secretos (`.env`, `credentials*`, tokens, claves). Si el usuario lo pide, avisar antes.
- Preferir `pull --rebase` a merge si la rama local no está compartida; nunca reescribir historia ya publicada.
- Antes de cerrar cambios de UI, recordar la verificación del proyecto: `npm run build` y `npm run lint` sin errores nuevos.

### 4. Después de la operación (verificación)

```bash
git status --short --branch
git log --oneline -3
git branch -vv
git ls-files --others --exclude-standard
```

Confirma: la operación surtió efecto, no quedaron restos (`.orig`, `.rej`, ficheros temporales), el árbol quedó limpio o con exactamente los cambios esperados, y la rama está sincronizada con su upstream.

## Formato de reporte

Sé breve. Un bloque compacto, sin repetir lo que el usuario ya dijo:

```
Git — <rama> · upstream: <sí/no> · <N> ahead / <N> behind
Estado: <árbol limpio | cambios pendientes | operación en curso>
Riesgos: <lista corta o "ninguno">
Sugerencia: <comando concreto o "nada que hacer">
```

Si no hay riesgos y todo está sincronizado, dilo en una línea y continúa con la tarea.

## Errores y bloqueos

Si un comando Git falla, no lo repitas a ciegas. Lee el error, comprueba el estado con `git status` y propón la salida (`--abort`, `stash`, `--continue`, recrear rama). Si la situación es ambigua o implica pérdida de trabajo, pregunta antes de actuar.
