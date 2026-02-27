# Badge Manager (Next.js + FastAPI)

Application web de saisie et generation de badges d identification, avec stockage PostgreSQL et chiffrement des donnees sensibles avant enregistrement.

## 1) Backend (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

### Generer une cle Fernet valide

```bash
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

Copier la cle generee dans `ENCRYPTION_KEY` dans `backend/.env`.

### Lancer l API

```bash
uvicorn app.main:app --reload --port 8000
```

## 2) Frontend (Next.js)

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## 3) Acces

- Frontend: `http://localhost:3000`
- API: `http://localhost:8000`
- Compte de test par defaut (dans `AUTHORIZED_USERS_JSON`):
  - `admin / admin123`

## 4) Docker (frontend + backend + PostgreSQL + pgAdmin)

### Fichiers ajoutes

- `docker-compose.yml`
- `backend/Dockerfile`
- `frontend/Dockerfile`
- `.env.docker.example`

### Lancement

```bash
cp .env.docker.example .env.docker
docker compose --env-file .env.docker up -d --build
```

### Arret

```bash
docker compose --env-file .env.docker down
```

### Acces Docker

- Frontend: `http://localhost:3000`
- API: `http://localhost:8000`
- PostgreSQL: `localhost:5432`
- pgAdmin: `http://localhost:5050`
  - Email: valeur `PGADMIN_DEFAULT_EMAIL`
  - Password: valeur `PGADMIN_DEFAULT_PASSWORD`

### Connexion PostgreSQL dans pgAdmin

- Host: `postgres`
- Port: `5432`
- User: valeur `POSTGRES_USER`
- Password: valeur `POSTGRES_PASSWORD`
- Database: valeur `POSTGRES_DB`

## Notes securite

- Le login est volontairement simple (liste predefinie + token memoire) comme demande.
- Les champs du badge sont chiffres avant insertion en base, puis dechiffres a la lecture.
- En production, il faut remplacer ce mecanisme par une auth robuste (JWT/session + stockage de sessions) et une gestion securisee des secrets.


État actuel
http://localhost:5050 répond bien (redirection /browser/)
Tu peux te connecter avec :
Email: admin@badge.com
Mot de passe: admin123# kardente
