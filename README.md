# Voice-Bot-v2
 discord bot which record Voice Channel in ogg format and upload to S3
# 🎙️ Discord Voice Recorder

A powerful **Discord bot** that records all users in a **voice channel**, and saves the conservation in the **.ogg audio format**.
Each user’s speech is accurately labeled with their Discord username — creating clean audio directly from voice chats.user get payed if he talks for 1-hour not if he silent.user can track ther balance and withdraw request. and admin will get notification to aprove request

---

## 🚀 Features

* ✅ **Join & record any voice channel**
* 🎧 **Simultaneous recording** of all users
* 📂 **Separate Audio file** for individual users
* 📂 **Track usre balance** usre can track tere balance and hour of recording
* 📂 **Withdraw request** user request fore there withdrawal
* 📂 **Admin aprovial** fAdmin will aprove the payment request

---

## 🛠️ Tech Stack

| Component                | Description                                  |
| ------------------------ | -------------------------------------------- |
| **Discord.js v14**       | For bot interactions & voice connection      |
| **@discordjs/voice**     | Capturing real-time voice data               |
| **Prism-Media**          | Audio decoding (Opus → PCM → OGG)            |
| **FFmpeg**               | Converts raw PCM to OGG format               |
| **@Discordjs/OPUS**          | Audio encoder and decoder for Discord voice features.            |
| **AWS S3**    | AWS S3 bucket for cloud file storage |
| **Node.js + ES Modules** | Runtime and structure                        |
| **MongoDB**               | To store all user data          |
| **dotenv**               | Securely load environment variables          |

---

## ⚙️ Installation & Setup

### 1. Clone this repository

```bash
git clone https://github.com/NoB0T21/BOT2.git
cd  bot2
```

### 2. Install dependencies

```bash
npm install
```

### 3. Bot Permission

```bash
speak
connect
Use Voice Activity
View Channels
Read Message
send Message History
```

### 3. Create a `.env` file

```bash
TOKEN=your_discord_bot_token
CLIENT_ID=your_CLIENT_ID
GUILD_ID=your_GUILD_ID
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECREAT_ACCESS_KEY=your_AWS_SECREAT_ACCESS_KEY
AWS_REGION=us-east-1
BUCKET_NAME=your_bucket_name
ADMIN_USER_ID=Discord_user_id # used to notify/approve withdraws
MONGO_URI=mongodb://localhost:27017/DiscordBot
```

> ⚠️ Keep your keys secret! Never commit `.env` files.

### 4. Run the bot

```bash
npm start
```

---

## 🎮 Commands

| Command  | Description                                                           |
| -------- | --------------------------------------------------------------------- |
| `/join`  | Bot joins your current voice channel and starts recording all members |
| `/balance`  | send message to track the user balance and spoken hour |
| `/withdraw`  | send withsraw request to admin |
| `/leave`  | Bot leave the channel and stop all recordings |


---

## 🧾 Output

When you click **stop recording** button

1. Stops recording of that individual member.
2. Converts each user’s PCM file to .wav.
3. Uploads all wav files to AWS S3 BUCKET.
4. calculate you money and add to your blance
---

## 📝 The recording is saved automatically in:

```
/recording/username-[timestamp].ogg
```


---

## 📁 Folder Structure

```
📦 BOT2
 ┣ 📂 recordings
 ┣ 📜 index.js
 ┣ 📜 .env
 ┗ 📜 package.json
```

---

## ⚡ Notes

* Each user’s audio is recorded **continuously**, even during silence (for synchronization).
* If the same user joins multiple times, their username and file are handled separately.
* Ensure **FFmpeg** is installed and available in your system PATH.

---

## 🧠 Example Use Case

Perfect for:

* Recording **Discord meetings**, **podcasts**, or **gaming sessions**

---

## 👨‍💻 Author

**Aryan Gawade**
💬 Full Stack Developer | AI Enthusiast | Discord Automation

📧 [Contact on GitHub](https://github.com/NoB0T21)
   
🔗 [LinkedIn](https://www.linkedin.com/in/aryan-gawade-3723672ab/)

---

## 👨‍💻 People Working on this Project

**Siddharth Keer**
💬 Data Analytics | AI Enthusiast | Discord Automation | Machine learning

📧 [Contact on GitHub](https://github.com/Siddharth-Keer)
   
🔗 [LinkedIn](https://www.linkedin.com/in/siddharth-keer-30141011s003n004)


---

## 🪪 License

This project is open source under the **MIT License** — feel free to modify and share!

---

⭐ If you like this project, don’t forget to **star the repo** and share it with your community!
