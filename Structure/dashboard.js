// Dashboard.js
const discord = require("discord.js");
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const ejs = require('ejs');
const client = require('../index');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON bodies
app.use(bodyParser.json());



//database
const Verification = require("../Database/verify");
const Welcome = require("../Database/welcome");
const Premium = require('../Database/premium');
const RedeemCode = require('../Database/redeemCode');

const crypto = require('crypto');

// Generate a random secret key (typically 32 or 64 characters)
const secretKey = crypto.randomBytes(32).toString('hex');

// Use this secret key in your express-session configuration
app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: false
}));

// Configure EJS as the view engine
app.set('views', path.join(__dirname, '../views'));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "public"));

// Discord OAuth configuration
passport.use(new DiscordStrategy({
  clientID: '1043002684141207623',
  clientSecret: 'IpIOtGicpWbCr0bTiiHGYjLaojp8TBS0',
  callbackURL: 'https://hinata-rg40yonaj-suhaibchoudhary.vercel.app/auth/discord/callback',
  scope: ['identify', 'guilds']
}, (accessToken, refreshToken, profile, done) => {
  const user = {
    id: profile.id,
    username: profile.username,
    guilds: profile.guilds,
    avatarURL: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,

  };

  return done(null, user);
}));

// Serialize and deserialize user data
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Initialize passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
  res.render("index.ejs", { client: client });
});


app.get('/auth/discord', passport.authenticate('discord'));
app.get('/auth/discord/callback', passport.authenticate('discord', {
  successRedirect: '/dashboard',
  failureRedirect: '/'
}));

const Permissions = require('discord.js').Permissions;

app.get('/dashboard', (req, res) => {
  if (req.user && req.user.guilds) {
    const guilds = req.user.guilds;

    // Check if the user has the "Manage Server" permission for each guild
    const guildsWithManageServerPerm = guilds.filter(guild => {
      const permissions = new discord.PermissionsBitField(guild.permissions_new);
      return permissions.has(discord.PermissionFlagsBits.ManageGuild);
    });

    res.render('dashboard.ejs', { user: req.user, guilds: guildsWithManageServerPerm, bot: client });
  } else {
    res.redirect('/auth/discord');
  }
});


app.get('/dashboard/:guildID', async (req, res) => {
  if (req.user && req.user.guilds) {
    const guild = client.guilds.cache.get(req.params.guildID);
    const user = req.user;
    if (!guild) return res.redirect("/dashboard");

    let member = guild.members.cache.get(req.user.id);
    if (!member) {
      try {
        await guild.members.fetch();
        member = guild.members.cache.get(req.user.id);
      } catch (err) {
        console.error(`Couldn't fetch the members of ${guild.id}: ${err}`);
      }
    }

    if (!member || !member.permissions.has(discord.PermissionFlagsBits.ManageGuild)) {
      return res.redirect("/dashboard");
    }
    res.render('settings.ejs', { user, guild });
  } else {
    res.redirect('/auth/discord');
  }
});

app.get('/dashboard/:guildID/announcement', async (req, res) => {
  if (req.user && req.user.guilds) {
    const guild = client.guilds.cache.get(req.params.guildID);
    const user = req.user;
    if (!guild) return res.redirect("/dashboard");

    let member = guild.members.cache.get(req.user.id);
    if (!member) {
      try {
        await guild.members.fetch();
        member = guild.members.cache.get(req.user.id);
      } catch (err) {
        console.error(`Couldn't fetch the members of ${guild.id}: ${err}`);
      }
    }

    if (!member || !member.permissions.has(discord.PermissionFlagsBits.ManageGuild)) {
      return res.redirect("/dashboard");
    }
    res.render('announcement', { user, guild });
  } else {
    res.redirect('/auth/discord');
  }
});

app.get('/dashboard/:guildID/verify', async (req, res) => {
  if (req.user && req.user.guilds) {
    const guild = client.guilds.cache.get(req.params.guildID);
    const user = req.user;

    if (!guild) {
      return res.redirect("/dashboard");
    }

    let member = guild.members.cache.get(req.user.id);
    if (!member) {
      try {
        await guild.members.fetch();
        member = guild.members.cache.get(req.user.id);
      } catch (err) {
        console.error(`Couldn't fetch the members of ${guild.id}: ${err}`);
      }
    }

    if (!member || !member.permissions.has(discord.PermissionFlagsBits.ManageGuild)) {
      return res.redirect("/dashboard");
    }

    let data;
    try {
      data = await Verification.findOne({ guildId: guild.id }).exec();
    } catch (err) {
      console.error(`Error fetching verification data: ${err}`);
      // Handle the error accordingly (e.g., show an error message)
      return res.redirect("/dashboard");
    }

    let channel = data ? guild.channels.cache.get(data.verificationChannel)?.name : "None";
    let role = data ? guild.roles.cache.get(data.verificationRole)?.name : "None";
    let isEnabled = data ? data.isEnabled : false;
    const successMessage = req.query.successMessage;

    res.render('verify', { successMessage, user, guild, client, channel, role, isEnabled });

  } else {
    res.redirect('/auth/discord');
  }
});


app.post('/dashboard/:guildID/verify', async (req, res) => {
  const guildID = req.params.guildID;
  const user = req.user;
  const guild = client.guilds.cache.get(guildID);
  if (!guild) return;

  const { channelSelect, roleSelect, isEnabled } = req.body;
  const isEnabledValue = isEnabled === 'on';

  try {
    // Find existing verification document for the guild
    const verification = await Verification.findOne({ guildId: guild.id });

    if (verification) {
      // If verification document exists, update the values
      verification.verificationChannel = channelSelect;
      verification.verificationRole = roleSelect;
      verification.isEnabled = isEnabledValue;
      await verification.save();
      console.log("Verification data updated");
    } else {
      // If verification document does not exist, create a new one
      const newVerification = new Verification({
        guildId: guild.id,
        verificationChannel: channelSelect,
        verificationRole: roleSelect,
        isEnabled: isEnabledValue,
      });
      await newVerification.save();
      console.log("New verification data created");
    }

    res.redirect(`/dashboard/${guildID}/verify?successMessage=Succesfully Saved`);
  } catch (error) {
    console.error("Error updating or creating verification data:", error);
    res.redirect("/error"); // Redirect to an error page
  }
});


app.get('/dashboard/:guildID/welcome', async (req, res) => {
  if (req.user && req.user.guilds) {
    const guild = client.guilds.cache.get(req.params.guildID);
    const user = req.user;

    if (!guild) {
      return res.redirect("/dashboard");
    }

    let member = guild.members.cache.get(req.user.id);
    if (!member) {
      try {
        await guild.members.fetch();
        member = guild.members.cache.get(req.user.id);
      } catch (err) {
        console.error(`Couldn't fetch the members of ${guild.id}: ${err}`);
      }
    }

    if (!member || !member.permissions.has(discord.PermissionFlagsBits.ManageGuild)) {
      return res.redirect("/dashboard");
    }

    let data;
    try {
      data = await Welcome.findOne({ guildId: guild.id }).exec();
    } catch (err) {
      console.error(`Error fetching welcome data: ${err}`);
      // Handle the error accordingly (e.g., show an error message)
      return res.redirect("/dashboard");
    }

    let channel = data ? guild.channels.cache.get(data.welcomeChannel)?.name : "None";
    let roles = data ? data.welcomeRoles : [];
    let isEnabled = data ? data.isEnabled : false;
    let welcomeMessage = data ? data.welcomeMessage : "";
    const successMessage = req.query.successMessage;

    res.render('welcome', { successMessage, user, guild, client, channel, roles, isEnabled, welcomeMessage });

  } else {
    res.redirect('/auth/discord');
  }
});

app.post('/dashboard/:guildID/welcome', async (req, res) => {
  // Extract the form data from the request body
  const { isEnabled, welcomeMessage, welcomeChannel } = req.body;

  // Retrieve the guild ID from the route parameters
  const guildID = req.params.guildID;

  try {
    // Find or create the Welcome document in the database based on the guild ID
    let welcome = await Welcome.findOne({ guildId: guildID });

    if (!welcome) {
      welcome = new Welcome({ guildId: guildID });
    }

    // Update the welcome settings
    welcome.isEnabled = isEnabled === 'on';
    welcome.welcomeMessage = welcomeMessage;
    welcome.welcomeChannel = welcomeChannel;

    // Save the updated welcome document
    await welcome.save();

    // Redirect to the welcome settings page with a success message
    res.redirect(`/dashboard/${guildID}/welcome?successMessage=Welcome settings saved successfully`);
  } catch (err) {
    console.error(`Error saving welcome settings: ${err}`);
    // Handle the error accordingly (e.g., show an error message)
    res.redirect(`/dashboard/${guildID}/welcome?errorMessage=Error saving welcome settings`);
  }
});


app.get('/dashboard/:guildID/redeem', async (req, res) => {
  if (req.user && req.user.guilds) {
    const guild = client.guilds.cache.get(req.params.guildID);
    const user = req.user;
    if (!guild) return res.redirect("/dashboard");

    let member = guild.members.cache.get(req.user.id);
    if (!member) {
      try {
        await guild.members.fetch();
        member = guild.members.cache.get(req.user.id);
      } catch (err) {
        console.error(`Couldn't fetch the members of ${guild.id}: ${err}`);
      }
    }

    if (!member || !member.permissions.has(discord.PermissionFlagsBits.ManageGuild)) {
      return res.redirect("/dashboard");
    }
    const premium = await Premium.findOne({ guildId: guild.id }).exec();

    res.render('redeem', { user, guild, premium });
  } else {
    res.redirect('/auth/discord');
  }
});

app.post('/dashboard/:guildId/redeem', async (req, res) => {
  try {
    const { guildId } = req.params;
    const { code } = req.body;

    const redeemCode = await RedeemCode.findOne({ code: code, used: false }).exec();
    if (!redeemCode) {
      return res.status(400).json({ error: 'Invalid or expired redeem code' });
    }

    let premium = await Premium.findOne({ guildId: guildId }).exec();
    if (!premium) {
      // Create a new premium record for the guild if it doesn't exist
      premium = new Premium({
        guildId: guildId,
        premium: true,
        expirationDate: redeemCode.expirationDate, // Set the expiration date same as redeem code
      });
    } else {
      // Update the premium status to true
      premium.premium = true;
      if (premium.expirationDate < Date.now()) {
        // If the current premium has expired, set the expiration date same as redeem code
        premium.expirationDate = redeemCode.expirationDate;
      } else {
        // If the current premium is still active, extend the expiration date by adding new redeem time
        premium.expirationDate = new Date(premium.expirationDate.getTime() + redeemCode.expirationDate.getTime() - redeemCode.expirationDate.setHours(0, 0, 0, 0));
      }
    }

    await premium.save();

    // Mark the redeem code as used
    redeemCode.used = true;
    await redeemCode.save();

    // Return a success response
    return res.status(200).json({ message: 'Premium activated successfully' });
  } catch (error) {
    console.error('An error occurred:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});




// Start the server
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});

