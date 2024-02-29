const express = require('express');
const knights = require('knights-canvas');
const axios = require('axios');
const fs = require('fs').promises;

const app = express();
const port = process.env.PORT || 5050;

app.get('/join', async (req, res) => {
  try {
    const bg = req.query.imagebackground;
    const groupname = req.query.groupname;
    const memberCount = req.query.count;

    // Assuming you have event.senderID and name parameters available
    const senderID = req.query.senderID;
    const username = req.query.name || "YourCustomUsername"; // Use the provided username or set a custom one

    // Construct avatar URL using event.senderID
    const avatarUrl = `https://graph.facebook.com/${senderID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

    // Download the profile picture
    const avatarResponse = await axios.get(avatarUrl, { responseType: 'arraybuffer' });

    // Save the profile picture to a file
    const avatarFilePath = __dirname + `/tmp/${senderID}_avatar.jpg`;
    await fs.writeFile(avatarFilePath, Buffer.from(avatarResponse.data, 'binary'));

    const image = await new knights.Welcome2()
      .setAvatar(avatarFilePath) // Use the downloaded profile picture
      .setUsername(username)
      .setBg(bg)
      .setGroupname(groupname)
      .setMember(memberCount)
      .toAttachment();

    const imageData = image.toBuffer();
    const welcomeFilePath = __dirname + '/tmp/sewelkom2.png';

    // Save the welcome image to a file
    await fs.writeFile(welcomeFilePath, imageData);

    res.sendFile(welcomeFilePath);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
