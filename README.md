# IrisProject Discord Bot v14

Discord Bot สำหรับจัดการ Discord Server ที่มาพร้อมฟีเจอร์ครบครัน พัฒนาด้วย Discord.js v14 และรองรับ AI Chat ด้วย Google Gemini

## รูปแบบการตอบรับ

บอทมีตัวตนเป็น "ไอริส" (Iris) เด็กสาวหูแมวผู้เรียบร้อยและขี้อาย ที่จะตอบโต้กับคุณอย่างสุภาพและเป็นกันเอง

## ฟีเจอร์หลัก

### ระบบ AI Chat
- คุยกับ AI ได้ในช่องที่กำหนด
- จำบริบทการคุยได้ (Chat History)
- รองรับการล้างประวัติการคุย
- **ระบบความสนิท** - ยิ่งคุยเยอะ ยิ่งสนิทมากขึ้น
- ตัวละคร "ไอริส" หูแมวเมดที่น่ารัก

### ระดับความสนิท
AI จะปรับการตอบโต้ตามระดับความสนิทของคุณ:

| ระดับ | จำนวนข้อความ | คำอธิบาย |
|--------|--------------|----------|
| `OWNER` | - | เจ้าของเซิร์ฟเวอร์ - สนิทที่สุด เปิดตัวได้เต็มที่ |
| `SOULMATE` | 200+ | เพื่อนที่ไว้ใจ - เปิดใจได้มากที่สุด |
| `CLOSE_FRIEND` | 100+ | เพื่อนสนิท - เริ่มสบายใจและเปิดตัวเอง |
| `FRIEND` | 50+ | เพื่อน - เริ่มคุ้นเคยดี |
| `ACQUAINTANCE` | 20+ | คุ้นหน้า - เริ่มจดจำ |
| `STRANGER` | 0-19 | คนแปลกหน้า - ขี้อย ตอบสั้นๆ |

### ระบบต้อนรับสมาชิกใหม่
- ส่งข้อความต้อนรับอัตโนมัติเมื่อมีสมาชิกใหม่เข้าเซิร์ฟเวอร์
- ให้บทบาท Guest อัตโนมัติ
- แจ้งกติกาเซิร์ฟเวอร์

### ระบบบทบาท (Role Management)
- ยอมรับกติกาเพื่อรับบทบาทพื้นฐาน (Guest/Customer)
- เลือกบทบาทเพิ่มเติมผ่าน Reaction
- รองรับบทบาทพิเศษสำหรับ Follower

### ระบบแจ้งเตือน Live Stream
- แจ้งเตือนอัตโนมัติเมื่อ Twitch Channel ไลฟ์สด
- ให้บทบาท On Stage ขณะไลฟ์
- สุ่มเลขกับรูปภาพเพื่อความหลากหลาย

### ระบบ Logging
- บันทึกกิจกรรมต่างๆ ในเซิร์ฟเวอร์
- บันทึกการใช้ Slash Commands
- เช่น: การเข้า-ออกของสมาชิก, การเปลี่ยนบทบาท, การเปลี่ยนสถานะ

## Slash Commands

| คำสั่ง | คำอธิบาย |
|--------|----------|
| `/ping` | ทดสอบการตอบสนองของบอท |
| `/checkstatus` | ตรวจสอบสถานะกิจกรรมปัจจุบันของคุณ |
| `/resetextrarole` | รีเซต Reaction สำหรับเลือกบทบาทเพิ่มเติม (เฉพาะเจ้าของเซิร์ฟเวอร์) |
| `/iris-info` | ดูข้อมูลการคุยกับไอริสของคุณ |
| `/iris-clear` | ล้างประวัติการคุยกับไอริส (ใน RAM) |
| `/iris-user-stats` | ดูสถิติการใช้งานไอริสทั้งหมด (เฉพาะเจ้าของเซิร์ฟเวอร์) |

## วิธีการคุยกับ AI

คุยกับไอริสได้ 2 วิธี:
1. **แทรก (Mention)** - พิมพ์ `@ไอริส` ตามด้วยข้อความ
2. **ตอบกลับ (Reply)** - ตอบกลับข้อความของบอทได้เลย

คำสั่งพิเศษในการคุย:
- `ลืมให้หมด`, `ล้างความจำ`, `reset` - ล้างประวัติการคุย

**หมายเหตุ:** AI จะคุยได้เฉพาะในช่องที่กำหนดเท่านั้น

## โครงสร้างโปรเจกต์

```
irisproject_discordbot14/
├── src/
│   ├── commands/          # คำสั่งและระบบต่างๆ
│   │   ├── gemini-chat.js      # AI Chat handler
│   │   ├── ai-helper.js        # AI Helper functions
│   │   ├── rolemanager.js      # Role management system
│   │   ├── message-noti-streaming.js  # Live notification
│   │   └── logging.js          # Logging system
│   ├── events/            # Event handlers
│   │   ├── ready.js            # Bot ready event
│   │   ├── guildMemberAdd.js   # New member join
│   │   ├── messageCreate.js    # Message created (AI chat)
│   │   ├── messageReactionAdd.js    # Reaction added
│   │   ├── messageReactionRemove.js # Reaction removed
│   │   ├── presenceUpdate.js   # Presence/streaming update
│   │   └── interactionCreate.js    # Slash command handler
│   ├── utils/             # ฟังก์ชันช่วยเหลือ
│   │   ├── logger.js           # Logger utility
│   │   ├── dateHelper.js       # Date formatting
│   │   ├── embedBuilder.js     # Discord embed builder
│   │   ├── ai-stats.js         # AI statistics & persistence
│   │   └── intimacy.js         # Intimacy level system
│   ├── config/            # การตั้งค่า
│   │   ├── index.js            # Config loader
│   │   ├── validator.js        # Config validation
│   │   └── persona.js          # AI persona definition
│   └── index.js           # ไฟล์หลัก
├── deploy-commands.js    # Script สำหรับลงทะเบียน Slash Commands
├── clear-all.js          # Script สำหรับลบ Commands ทั้งหมด
├── .env                  # Environment variables (ไม่ส่งขึ้น git)
├── .env.example          # Template สำหรับ .env
├── .gitignore            # Git ignore rules
└── package.json          # Project dependencies
```

## การติดตั้ง

### 1. Clone Repository
```bash
git clone <repository-url>
cd irisproject_discordbot14
```

### 2. ติดตั้ง Dependencies
```bash
npm install
```

### 3. ตั้งค่า Environment Variables
คัดลอก `.env.example` เป็น `.env` และกรอกค่าที่จำเป็น:

```bash
cp .env.example .env
```

แก้ไข `.env` ดังนี้:
```env
# Bot Configuration
TOKEN=your_bot_token_here
ClientID=your_client_id_here
GUILD_ID=your_guild_id_here

# Bot Settings
BotWelcomeMessage=ยินดีต้อนรับค่ะ
TwitchUrl=https://www.twitch.tv/your_channel
StreamerUsername=your_twitch_username

# Channel IDs
LoggingChannelId=your_logging_channel_id
WelcomeChannelId=your_welcome_channel_id
RuleChannelId=your_rule_channel_id
NotiChannelId=your_notification_channel_id
ExtraRoleChannelId=your_extra_role_channel_id

# AI Chat Channels
AI_CHANNEL_1=your_channel_id_1
AI_CHANNEL_2=your_channel_id_2

# Message IDs
RuleMessageId=your_rule_message_id
ExtraRoleMessageId=your_extra_role_message_id

# Emoji IDs
GenshinEmojiId=your_genshin_emoji_id
PSO2EmojiId=your_pso2_emoji_id

# Role IDs
FollowerLiveRoleId=your_follower_live_role_id

# AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. ลงทะเบียน Slash Commands
```bash
npm run deploy
```

### 5. รันบอท
โหมดปกติ:
```bash
npm start
```

โหมด Development (auto-reload):
```bash
npm run dev
```

## การใช้งาน

### การ Deploy Commands
```bash
npm run deploy
```

### การล้าง Commands
```bash
npm run clear-all
```

### การรีเซต Role Message
หากต้องการรีเซตข้อความที่ใช้เลือกบทบาท:
```
/resetextrarole
```

## ไฟล์ข้อมูลที่สร้างอัตโนมัติ

บอทจะสร้างไฟล์ต่อไปนี้อัตโนมัติเมื่อรัน:
- `ai-stats.json` - เก็บสถิติการคุยกับ AI (ระดับความสนิท, จำนวนข้อความ)

## การขอ Permission

บอทต้องการ Permission ดังนี้:
- `Guild Members` - เพื่อตรวจสอบสมาชิกใหม่และเจ้าของเซิร์ฟเวอร์
- `Messages` - เพื่อรับและส่งข้อความ
- `Message Content` - เพื่ออ่านเนื้อหาข้อความ
- `Add Reactions` - เพื่อเพิ่ม Reaction
- `Manage Messages` - เพื่อจัดการข้อความ
- `Manage Roles` - เพื่อมอบบทบาทให้สมาชิก

## Dependencies

- [discord.js](https://discord.js.org/) v14.7.1 - Discord API Library
- [@google/genai](https://www.npmjs.com/package/@google/genai) v2.3.0 - Google Gemini AI SDK
- [dotenv](https://www.npmjs.com/package/dotenv) v16.0.3 - Environment Variables

## License

ISC

---

สร้างด้วย หัวใจ โดยทีมพัฒนา IrisProject
