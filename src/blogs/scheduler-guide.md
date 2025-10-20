---
title: WriteStack Scheduler Guide
description: A guide to scheduling and automating Substack Notes with WriteStack.
author: Orel Zilberman
authorImage: "https://apps-og-images.s3.us-east-1.amazonaws.com/write-room/orel-profile.png"
authorLink: "https://substack.com/@orelzilberman/"
publishedAt: 2025-10-19
updatedAt: 2025-10-19
---

# 🗓️ WriteStack Scheduler Guide {#writestack-scheduler-guide}

Your guide to scheduling and automating Substack Notes with WriteStack.

---

## 🚀 What the Scheduler Does {#what-the-scheduler-does}

The WriteStack Scheduler helps you **stay consistent**, **save time**, and **batch your writing**.  
You can plan your Notes in advance and WriteStack will automatically publish them on Substack at the scheduled time.

---

## 🧩 Step 1 — Install the WriteStack Chrome Extension {#install-extension}

To make scheduling work, you need the WriteStack Chrome Extension.

👉 [Download the WriteStack Extension](https://chromewebstore.google.com/detail/writestack/emdlbnkhjpfcooclfbodmhkhkohcjaoa)

Once installed, pin it to your Chrome toolbar for easy access.

> **Note:** WriteStack works on any Chromium-based browser — such as **Google Chrome**, **Brave**, **Edge**, or **Arc**.

---

## 🕒 Step 2 — Schedule a Note {#schedule-note}

1. Open the [**WriteStack Notes**](https://writestack.io/notes) page.  
2. Write, generate or repurpose a Note.  
3. Click **Add to Queue** or **Schedule Note**.

That’s it — an alarm will be created in your browser for that time.

![Schedule a Note](https://apps-og-images.s3.us-east-1.amazonaws.com/write-room/blogs/scheduler-guide/add-to-queue.png)

---

## ⚡ Step 3 — Keep It Running {#keep-it-running}

For your scheduled Note to post successfully, make sure:

1. **WriteStack is running** in a Chrome (or Chromium) browser.  
2. **Your computer is on and unlocked.** 
3. **You’re logged in to Substack** on the same Chrome profile you used for WriteStack.  
4. **The WriteStack extension is active** (not removed or paused).

If any of these aren’t true when the schedule goes off, the Note won’t post.

> 💡 Most people miss scheduled Notes because their computer is **locked or asleep** at the scheduled time.

*P.S.
This is a Substack limitation. If anybody offers you a tool that schedules from their servers, you're putting your Substack account at risk.*

Here's how it should look:
![Scheduler Active](https://apps-og-images.s3.us-east-1.amazonaws.com/write-room/blogs/scheduler-guide/queue-example.png)

---

## Possible issues {#possible-issues}

### Note schedule was missed

Note schedules that are not sent within 10 minutes of the scheduled time will be marked as missed. They will not be sent automatically.

In order to resend the note, you can either:
1. One-click post it from the app/extension.
2. Change the schedule time to a later time.
3. One-click post it from the email you'll get 20 minutes after the note was missed.

**Important:** If you miss a bunch of notes, they will not be sent in a batch when you open your Chrome. They will stay in the queue, marked as missed.

Here's how a missed note looks:
![Missed Note](https://apps-og-images.s3.us-east-1.amazonaws.com/write-room/blogs/scheduler-guide/missed-note.png)

### Schedule warning

Sometimes you will see a yellow triangle next to the scheduled note. That could be because:
1. Scheduled the note from a different computer/profile/browser.
2. The extension was deleted and reinstalled.
3. Something went wrong.

The third option is very rare. Now, if you see the warnings, you can easily fix it by clicking the "Fix scheduling warning" button.
Here's how it looks:
![Fix Scheduling Warning](https://apps-og-images.s3.us-east-1.amazonaws.com/write-room/blogs/scheduler-guide/fix-scheduling-warning.png)

This will fix all the warnings of all the notes that have a warning in a few seconds.
![Fixing Scheduling Warnings](https://apps-og-images.s3.us-east-1.amazonaws.com/write-room/blogs/scheduler-guide/fixing-scheduling-warning.png)

## 💻 How to Keep Your Computer On and Unlocked {#how-to-keep-your-computer-on-and-unlocked}

For your scheduled Notes to post successfully, your computer must stay **on, awake, and unlocked** while WriteStack runs in your browser.  
Here’s how to keep it that way without killing your battery or your sanity.

---

### 🖥️ Mac (macOS Ventura, Sonoma, or newer)

#### Option 1 — Adjust System Settings
1. Open **System Settings → Displays → Advanced...**  
   Turn **off** “Prevent automatic sleeping when the display is off.”
2. Go to **System Settings → Lock Screen**, then set:
   - **Turn display off when inactive** → *Never* (or however long you need).
   - **Require password after screen saver begins or display is turned off** → *Never* (optional if you’re around).
3. Keep your Mac **plugged in** if possible. Sleep can still trigger on battery even if the display stays on.

#### Option 2 — Use Amphetamine (recommended)
👉 [Download Amphetamine (Mac App Store)](https://apps.apple.com/us/app/amphetamine/id937984704)

Amphetamine is a free, trusted app that keeps your Mac awake on command.  
Once installed:
1. Click the ☕ icon in the top menu bar.  
2. Choose **Indefinitely** or set a custom duration (like 2 hours).  
3. (Optional) Create a “WriteStack” trigger so Amphetamine auto-activates whenever Chrome is running.

Amphetamine prevents system sleep and can even keep the display awake if you enable that option.

---

### 🪟 Windows (Windows 10 & 11)

#### Option 1 — Adjust Power Settings
1. Go to **Settings → System → Power & battery → Screen and sleep.**
2. Set the following:
   - **On battery power, turn off my screen after** → *Never*
   - **When plugged in, turn off my screen after** → *Never*
   - **Put my device to sleep after** → *Never*
3. Keep your computer **plugged in** during longer scheduling sessions.

#### Option 2 — Use a “Stay Awake” Utility
You can use one of these lightweight apps:

- **[Caffeine for Windows](https://www.zhornsoftware.co.uk/caffeine/):** simulates a keypress every 59 seconds to prevent sleep.  
- **[PowerToys Awake](https://learn.microsoft.com/en-us/windows/powertoys/awake):** built by Microsoft, lets you keep your PC awake indefinitely or for a set time without changing system settings.

Both tools are safe, lightweight, and widely used to keep Windows awake during automation tasks.

---

### ⚡ Quick Recap

- Keep Chrome or your Chromium-based browser **open** and logged into your Substack account.  
- Make sure your computer stays **on and unlocked** (Amphetamine for Mac, Caffeine/PowerToys Awake for Windows).  
- Plug in your device to prevent sleep triggers on battery.  

That’s it — your WriteStack schedules will fire right on time.


---

## Personal Suggestions {#personal-suggestions}

In this section, I'll share personal suggestions based on my experience and questions I've received from users.

1. **Don't optimize for the algorithm** - This one makes or breaks some creators' consistency, because it's means that they have to schedule during the night, and then the computer locks. 
What I personally do is I schedule my Notes during my working hours, so I know they are sent while I'm working and I don't need to worry about them.

---

## 💬 FAQ {#faq}

### What happens if my computer is off when the schedule time arrives?
The Note won’t be sent and you will receive a missed note email. Keep your computer **on, unlocked, and online** during the scheduled time.

### Do I need to keep the dashboard open?
No. As long as your browser is open and the WriteStack extension is installed, you’re good..

### What if I uninstall the extension?
Your schedules won’t run. Reinstall the extension to resume scheduling.

---