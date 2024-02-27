const express = require('express');
const knights = require('knights-canvas');
const axios = require('axios');
const fs = require('fs').promises;

const app = express();
const port = process.env.PORT || 5050;

app.get('/join', async (req, res) => {
  try {
    const id1 = req.query.name; // Using query parameters for simplicity
    const username = id1; // You can customize this based on your needs
    const bg = req.query.imagebackground;
    const groupname = req.query.groupname;
    const memberCount = req.query.count;

    const avatarUrl = `https://graph.facebook.com/${id1}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

    const image = await new knights.Welcome2()
      .setAvatar(avatarUrl)
      .setUsername(username)
      .setBg(bg)
      .setGroupname(groupname)
      .setMember(memberCount)
      .toAttachment();

    const data = image.toBuffer();
    const filePath = __dirname + '/tmp/sewelkom2.png';

    await fs.writeFile(filePath, data);

    res.sendFile(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
