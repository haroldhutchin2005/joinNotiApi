const express = require('express');
const knights = require('knights-canvas');
const axios = require('axios');
const fs = require('fs').promises;

const app = express();
const port = process.env.PORT || 5000;

async function getFullName(userId) {
  try {
    const response = await axios.get(`https://graph.facebook.com/${userId}?fields=first_name,last_name&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
    const { first_name, last_name } = response.data;
    return `${first_name} ${last_name}`;
  } catch (error) {
    console.error(`Error fetching user information for ID ${userId}:`, error.message);
    return `User${userId}`;
  }
}

app.get('/join', async (req, res) => {
  try {
    const userId = req.query.name;
    const fullName = await getFullName(userId);

    const avatarUrl = `https://graph.facebook.com/${userId}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

    // Download the profile picture
    const avatarResponse = await axios.get(avatarUrl, { responseType: 'arraybuffer' });

    // Save the profile picture to a file
    const avatarFilePath = __dirname + `/tmp/${userId}_avatar.jpg`;
    await fs.writeFile(avatarFilePath, Buffer.from(avatarResponse.data, 'binary'));

    const image = await new knights.Welcome2()
      .setAvatar(avatarFilePath) // Use the downloaded profile picture
      .setUsername(fullName)
      .setBg(req.query.imagebackground)
      .setGroupname(req.query.groupname)
      .setMember(req.query.count)
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
