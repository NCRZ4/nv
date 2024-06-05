const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActivityType,
} = require("discord.js");
const { EventEmitter } = require("events");
const fs = require("fs");
const { QuickDB } = require("quick.db");
const events = new EventEmitter();
const config = JSON.parse(
  fs.readFileSync("./config.def", { encoding: "utf-8" })
);

const db = new QuickDB({ filePath: "database.def" });

const client = new Client({
  intents: Object.keys(GatewayIntentBits).map((a) => {
    return GatewayIntentBits[a];
  }),
});
client.on("ready", () => {
  console.log("[BOT] :: token has authorized .");
  setInterval(() => {
    client.users.cache.forEach(async ({ id }) => {
      let bank = await db.tableAsync("bank");
      let times = await db.tableAsync("times");
      let date = await times.get(`سحب_القرض_${id}`);
      if (date == false) {
        await times.delete(`سحب_القرض_${id}`);
        return;
      }
      if (date && date < new Date().getTime()) {
        let carncy = await bank.get(`money_${id}`);
        await bank.set(`money_${id}`, String(Number(carncy) - 100000));
        await times.delete(`سحب_القرض_${id}`);
      }
    });
  }, 1000);
});

client.on("ready", async () => {
  await setInterval(async () => {
    let bank = await db.tableAsync("bank");
    bank.all().then(async (id, value) => {
      if (String(value).includes("-")) await bank.set(id, String(0));
    });
  });
});

client.on("messageCreate", async (msg) => {
  if (msg.channel.isDMBased()) return;
  if (msg.author.bot) return;
  let baseData = await db.tableAsync("base");

  //                                                                   //
  if (msg.content == "اوامري") {
    if (
      (await db.get("owners"))?.includes(msg.author.id) ||
      config.owners.includes(msg.author.id)
    ) {
      msg.reply({
        embeds: [
          {
            
            author: {
              name: msg.guild.name,
              icon_url: msg.guild.iconURL(),
            },
            description:
            `**الأوامر الخاصة بمالك البوت\nمدير: لتعيين مدير للبنك\nقائمة: لاظهار قائمة المدراء في السيرفر\nتطفير: لتصفير جميع الأعضاء\nتصفير: لتصفير حساب عضو\nحوالات: لتعطيل نظام التحويل\nعطه: لإعطاء مبلغ لشخص\nخصم: لخصم مبلغ من شخص\nمنع: لمنع شخص من اللعب\nسماح: لسماح الشخص بالعب\nممنوعين: لاظهار قائمة الممنوعين \nsetbank  تفعيل البنك\nsetlog  لوق البنك\nsetback  لوضع خلفية خاصة\nsetembed  لوضع امبد\nsetcolor  لتغيير لون الامبد\nsetowner  تعيين اونر\nsetname  تغيير اسم البوت \nsetavatar  تغيير صورة البوت\nsetgame  كتابة حالة البوت\nsetstatus  تغيير حالة البوت\nsetstreaming  لتغير حالة البوت الى استريم\nsetprefix  تغيير دالة البوت**`,
          },
        ],
      });
    }
  }
  if (msg.content.startsWith("setprefix")) {
    if (
      (await db.get("owners"))?.includes(msg.author.id) ||
      config.owners.includes(msg.author.id)
    ) {
      let arg = msg.content.split(" ")[1];
      if (!arg) return msg.reply("**يرجى كتابة الدالة الجديده  **      `` setprefix new prefix ``");
      await db.set("prefix", arg);
     // msg.reply("**تم تغير دالة البوت **");
      msg.react("✅");
    }
  }
  if (msg.content.startsWith("setgame")) {
    if (
      (await db.get("owners"))?.includes(msg.author.id) ||
      config.owners.includes(msg.author.id)
    ) {
      let arg = msg.content.split(" ")[1];
      if (!arg) return msg.reply("**يرجى كتابة الحاله الجديده  **      `` setgame new game ``");
      client.user.setActivity({
        type: 0,
        name: arg,
      });
      msg.react("✅");
    }
  }
  if (msg.content.startsWith("setstatus")) {
    if (
      (await db.get("owners"))?.includes(msg.author.id) ||
      config.owners.includes(msg.author.id)
    ) {
      let arg = msg.content.split(" ")[1];
      if (!arg) return msg.reply("**يرجى كتابة الحاله الجديده  'online dnd  idle'**      `` setstatus new status ``");
      client.user.setStatus(arg);
      msg.react("✅");
    }
  }
  if (msg.content.startsWith("setname")) {
    if (
      (await db.get("owners"))?.includes(msg.author.id) ||
      config.owners.includes(msg.author.id)
    ) {
      let arg = msg.content.split(" ")[1];
      if (!arg) return msg.reply("**يرجى ارفاق الاسم الجديد .**      `` setname  new name  ``");
      await client.user.setUsername(arg);
      msg.react("✅");
    }
  }
  if (msg.content.startsWith("setavatar")) {
    if (
      (await db.get("owners"))?.includes(msg.author.id) ||
      config.owners.includes(msg.author.id)
    ) {
      let arg = msg.content.split(" ")[1];
      if (!arg) return msg.reply("**يرجى ارفاق الصوره او الرابط .**      `` setavatar  new avatar  ``");
      client.user.setAvatar(arg);
      msg.react("✅");
        }
  }
  if (msg.content.startsWith("setstreaming")) {
    if (
      (await db.get("owners"))?.includes(msg.author.id) ||
      config.owners.includes(msg.author.id)
    ) {
      let arg = msg.content.split(" ")[1];
      if (!arg) return msg.reply("**يرجى كتابة الحاله الجديده  **      `` setstreaming new streaming ``");
      client.user.setActivity({
        name: arg,
        type: ActivityType.Streaming,
        url: "https://twitch.tv/" + arg,
      });
      msg.react("✅");
    }
  }
  if (msg.content.startsWith("setowner")) {
    if (
      (await db.get("owners"))?.includes(msg.author.id) ||
      config.owners.includes(msg.author.id)
    ) {
      let arg = msg.mentions.users.first();
      if (!arg) return msg.reply("**يرجى ارفاق منشن العضو **      `` setowner  @new owner  ``");
      let check = await db.get("owners");
      if (!check) await db.set("owners", [arg.id]);
      else {
        if (check.includes(arg.id)) {
          let array = [];
          check.forEach((id) => {
            if (id == arg.id) {
            } else array.push(id);
          });
          console.log(array, check);
          await db.set("owners", array);
        } else await db.push("owners", arg.id);
      }
      msg.react("✅");
    }
  }
  //                                                                  //
  if (msg.content == "اوامر") {
    //if ((await db.get("owners"))?.includes(msg.author.id) || config.owners.includes(msg.author.id)) {
      msg.reply({
        embeds: [
          {
            author: {
              name: msg.guild.name,
              icon_url: msg.guild.iconURL(),
            },
            description:
            `**الأوامر الخاصة بالبوت\nبخشيش\nتحويل\nتوب\nحراميه\nرهان\nحظ\nراتب\nسداد\nفلوس\nقرض\nنهب\nوقت\nزواج\nطلاق\nخلع\nزواجي\nزواجات\nاستثمار\nتداول\nحماية\nفواكه\nقمار\nلعبه\nلون\nحراميه** \nDev: <@848675127427203133>   `,
          },
        ],
      });
  //  }
  }

  let prefix = (await db.get("prefix")) ?? config.prefix;
  if (msg.content.startsWith(prefix)) {
    let commandName = msg.content.split(" ")[0].split(prefix).join("").trim();
    if (commandName == "") return;
    let args = msg.content
      .split(prefix)
      .join("")
      .split(commandName)
      .join("")
      .trim()
      .split(" ");
    let commandFile = fs.existsSync("./commands/admin/" + commandName + ".js");
    if (commandFile) {
      commandFile = require("./commands/admin/" + commandName + ".js");
      let command = new commandFile(msg, config, db);
      let mods = await db.tableAsync("mods");
      let allowed = msg.member.permissions.has("Administrator");
      if ((await mods.get(msg.author.id)) == true) allowed = true;
      if ((await command.isAdmin()) && !allowed) {
        await msg.react("❌");
        return;
      }
      await command.run(args, events);
    }
  } else if (
    !msg.content.startsWith(prefix) &&
    msg.channel.id == (await baseData.get(`bankChannel_${msg.guild.id}`))
  ) {
    let blacklist = await db.tableAsync("blacklist");
    let list = (await blacklist.get(msg.guild.id)) ?? [];
    if (list.includes(msg.author.id))
      return msg.reply(" ممنوع من اللعب ");
    let commandName = msg.content.split(" ")[0].trim();
    if (commandName == "") return;
    let args = msg.content.split(commandName).join("").trim().split(" ");
    let commandFile = fs.existsSync("./commands/public/" + commandName + ".js");
    if (commandFile) {
      commandFile = require("./commands/public/" + commandName + ".js");
      let command = new commandFile(msg, config, db);
      if (
        (await command.isAdmin()) &&
        !msg.member.permissions.has("Administrator")
      ) {
        await msg.react("❌");
        return;
      }
      await command.run(args, events);
    }
  }
});

events.on("log", async (guild, data) => {
  let baseData = await db.tableAsync("base");
  let channelId = await baseData.get(`logChannel_${guild.id}`);
  if (!channelId) return;
  let channel = client.channels.cache.get(channelId);
  channel.send({
    embeds: [
      new EmbedBuilder()
        .setColor("Greyple")
        .setDescription(data.value)
        .setTimestamp(data.date)
        .setThumbnail(guild.iconURL())
        .setFields([
          {
            name: "بواسطة:",
            value: `\`\`\`\n${data.author.username} (${data.author.id})\`\`\``,
          },
        ]),
    ],
  });
});

client
  .login(config.token)
  .catch((err) => console.log("[ERROR] :: " + err.message));
