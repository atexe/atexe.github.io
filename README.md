# 🎮 BRICK BREAKER - How to Put This Online

This guide is written for people with **no technical experience**. Just follow the steps!

---

## 📋 What You Have

You have 5 files that work together to make a game:

```
index.html          ← The main page (the "home" of your game)
config.json         ← Game settings and colors (optional)
css/style.css       ← How the game looks (colors, buttons, etc)
js/game.js          ← The game code (makes everything work)
README.md           ← This file
```

---

## Step 1: Create a GitHub Account (Free!)

1. Go to **github.com** in your web browser
2. Click **Sign Up** (top right)
3. Enter your email address
4. Create a password
5. Choose a username (example: `myusername`)
6. Click through the verification steps
7. **Done!** You now have a GitHub account

---

## Step 2: Create a New Repository

A "repository" is just a folder on GitHub where you store your game files.

1. Log into GitHub (github.com)
2. Click the **+** icon (top right corner) → **New repository**
3. Name it exactly: `myusername.github.io`
   - Replace `myusername` with YOUR GitHub username
   - **Important:** This exact name makes it work as a website!
4. Check the box: **Add a README file**
5. Click **Create repository**

✅ **Your repository is created!**

---

## Step 3: Upload Your Game Files

Now you'll add your 5 game files to the repository.

### Adding index.html

1. In your repository, click **Add file** (green button) → **Upload files**
2. Click **choose your files** or drag-and-drop
3. Select `index.html` from your computer
4. Click **Commit changes** (bottom)

### Adding the css folder and style.css

1. Click **Add file** → **Create new file**
2. Type in the name box: `css/style.css`
   - GitHub will automatically create the `css` folder!
3. Leave it blank for now, just click **Commit changes**
4. Now click **Add file** → **Upload files**
5. Upload `style.css` 
6. **Important:** Make sure it goes in the `css` folder
7. Click **Commit changes**

OR use this simpler method:
1. Click **Upload files**
2. Drag the entire `css` folder onto the page
3. Click **Commit changes**

### Adding the js folder and game.js

1. Click **Add file** → **Upload files**
2. Drag the entire `js` folder onto the page
3. Click **Commit changes**

### Adding config.json

1. Click **Add file** → **Upload files**
2. Select `config.json`
3. Click **Commit changes**

**✅ All files uploaded!**

---

## Step 4: Enable GitHub Pages

This makes your repository into a live website.

1. In your repository, click **Settings** (top menu)
2. Click **Pages** (left sidebar)
3. Under "Source", select **main** (or **master**)
4. Click **Save**
5. Wait 1-2 minutes
6. You'll see a message: "Your site is published at..."

**Your game is now LIVE!** 🎉

---

## Step 5: Share Your Game!

Your game URL is:
```
https://myusername.github.io
```

Replace `myusername` with your actual GitHub username.

**Share this link with friends!** They can play right in their browser.

---

## 📁 File Structure

Your repository should look like this:

```
myusername.github.io/
├── index.html
├── config.json
├── README.md
├── css/
│   └── style.css
└── js/
    └── game.js
```

---

## 🎮 How to Play

**On Desktop:**
- Move mouse left/right to control the paddle
- Click to launch the ball

**On iPhone/Mobile:**
- Drag your finger to move the paddle
- Tap the screen to launch the ball

---

## 🛠️ Making Changes Later

If you want to change something (like colors or game speed):

1. Go to your repository on GitHub
2. Click the file you want to edit (e.g., `css/style.css`)
3. Click the **pencil icon** (edit button)
4. Make your changes
5. Click **Commit changes**
6. Wait 1-2 minutes for the changes to show up on your live website

---

## 🐛 Troubleshooting

### "My game isn't showing up"
- Wait 2-3 minutes after uploading
- Check your repository name is exactly `yourusername.github.io`
- Try opening it in a private/incognito window

### "The files aren't in the right place"
- Check that `index.html` is in the main folder (root)
- Check that `style.css` is inside a `css` folder
- Check that `game.js` is inside a `js` folder
- See the file structure above for reference

### "The game isn't working"
- Make sure all 5 files are uploaded
- Check that folder names (`css`, `js`) match exactly
- Try refreshing the page (Ctrl+R or Cmd+R)
- Check the browser console for errors (F12 → Console tab)

---

## 📝 Customizing Your Game

Want to change colors, speed, or other settings?

### Change the title of your game
1. Open `index.html` in a text editor
2. Find the line: `<title>BRICK BREAKER - Play Online</title>`
3. Change "BRICK BREAKER" to whatever you want
4. Save and commit

### Change colors
1. Open `css/style.css`
2. Find the `:root` section at the top
3. Edit the color values:
   - `--neon-cyan: #00f5ff;` ← Cyan color
   - `--neon-pink: #ff006e;` ← Pink color
   - etc.
4. Use any hex color from: https://htmlcolorcodes.com
5. Save and commit

### Change game speed
1. Open `config.json`
2. Change `"initialBallSpeed": 4.5` to a higher number (faster) or lower (slower)
3. Save and commit

---

## 💡 Tips

- **Backup your files:** Keep copies on your computer
- **Test before sharing:** Play the game yourself to make sure it works
- **Use a short URL:** You can use GitHub's URL shortener or TinyURL
- **Add a description:** Edit your repository description to tell people what it is

---

## 🎉 You're Done!

Your game is now live on the internet! Share it with friends, family, or everyone. 

To share, just give them the link:
```
https://yourusername.github.io
```

---

## 📞 Need Help?

- **GitHub Help:** https://docs.github.com
- **GitHub Pages:** https://pages.github.com
- **Hex Color Picker:** https://htmlcolorcodes.com

Good luck, and have fun! 🚀
