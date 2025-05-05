<p align="center">
  <img src="frontend/src/assets/SoundBond/SoundBondViola.png" alt="Logo" width="180"/>
</p>

<h2 align="center">La tua musica, le tue connessioni.</h2>

**SoundBond** è un social network musicale che abbina utenti in base ai loro gusti. Ascolta brani, esplora nuove playlist, invia richieste e chatta con chi condivide la tua passione.

### 🚀 Funzionalità principali

- 🔒 Registrazione e login sicuri tramite ASP.NET Identity
- 🎵 Playlist personalizzate in base ai gusti musicali
- 🎧 Player musicale con preview via API Deezer
- 🤝 Sistema di match tra utenti compatibili
- 📝 Creazione profilo musicale con generi, artisti e brani preferiti
- 💬 Chat in tempo reale tramite SignalR
- 🌟 Feedback sull’esperienza utente

<hr/>

### 🛠️ Tech Stack

**Frontend**

- React + Vite
- TailwindCSS
- Redux Toolkit
- React Router DOM

**Backend**

- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- ASP.NET Identity
- SignalR

**Servizi esterni**

- Deezer API

<hr/>

### 💻 Installazione e setup

**Prerequisiti**

- Node.js

- .NET 8 SDK

- SQL Server

- Visual Studio 2022 o superiore

**Frontend**

Apri il terminale ed esegui i seguenti comandi:

```bash
$ git clone https://github.com/camillazicari/CAPSTONE.git
$ cd CAPSTONE
$ npm install
$ npm run dev
```

**Backend**

1. Apri SoundBond.API con Visual Studio

2. Configura appsettings.json con la tua stringa di connessione per SQL Server

3. Applica le migration (se necessario) eseguendo i comandi:

```bash
$ dotnet ef database update
```

4. Avvia il progetto (assicurati che usi HTTP)

<hr/>

### 🔮 Funzionalità future

Notifiche real-time

Modalità ascolto condiviso

Miglioramenti all'algoritmo di match

Integrazione Spotify
