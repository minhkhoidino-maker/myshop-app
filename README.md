# MyShop App

A web app with 3 Docker containers:

| Container    | What it is                      | Port |
|--------------|---------------------------------|------|
| `db_1`       | PostgreSQL database             | 5432 |
| `api_1`      | REST API (Node.js + restify)    | 8080 |
| `frontend_1` | React website                   | 3000 |

## 1. Get the `.env` file

The `.env` file holds passwords, so it is **not** in this repository.

1. Contact the team leader to get the values.
2. Copy the template and fill in the values:

```bash
cp .env.sample .env
```

## 2. Build and start the containers (first time)

```bash
docker-compose up --build
```

Wait until you see `restify listening at http://[::]:8080` and `Compiled successfully!`.

> In GitHub Codespaces: open the **Ports** tab, right-click port **8080** → **Port Visibility → Public**, otherwise the React page cannot load the data.

## 3. Run the migrations (create the tables)

Open a **second terminal** and connect to the API container:

```bash
docker exec -it api_1 /bin/bash
knex migrate:latest
```

## 4. Run the seeds (add sample data) — first time only

Still inside the `api_1` container:

```bash
knex seed:run
exit
```

Open http://localhost:3000 (or port 3000 in Codespaces) to see the list of rooms.

## 5. Adding a new package

Libraries are installed **inside** the containers, never in your local folder.

1. Add the package to `package.json` without creating `node_modules`:

   ```bash
   cd api-server        # or: cd frontend-react
   npm install --save --force --package-lock-only <package-name>
   cd ..
   ```

   If you used a normal `npm install`, delete the `node_modules` folder afterwards.

2. Rebuild the containers:

   ```bash
   docker-compose up --build
   ```

## Rules

- Never commit `.env` or `node_modules` (they are listed in `.gitignore`).
- Add new tables with a **new migration** (`knex migrate:make <name>`); never edit a migration that teammates have already run.
