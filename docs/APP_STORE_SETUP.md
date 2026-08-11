# Turning KJV for the Deaf into App Store / Google Play apps

This repo is now set up with [Capacitor](https://capacitorjs.com/), which wraps
the live site (kjvdeaf.com) in a real native app shell for iOS and Android.
The app doesn't bundle a copy of the site — it loads the live URL, so every
update you push to the website shows up in the app immediately, with **no
app-store review needed for content changes.** Store review is only needed
once, to get the app itself approved and listed.

## What's already done (in this codebase)

- `capacitor.config.ts` — points the native shell at `https://kjvdeaf.com`
- `@capacitor/core`, `@capacitor/ios`, `@capacitor/android`, `@capacitor/cli`
  added to `package.json`
- Helper scripts: `npm run cap:add:ios`, `cap:add:android`, `cap:sync`,
  `cap:open:ios`, `cap:open:android`

## What still has to happen on a real computer

I can edit files in this repo, but I can't run terminal commands, use Xcode,
use Android Studio, or submit anything to Apple/Google — those steps need a
person (you, or a developer you hire) sitting at an actual computer. Here's
the exact path:

### For Android (easier, cheaper, do this one first)

1. Install [Android Studio](https://developer.android.com/studio) (free, any
   Windows/Mac/Linux computer).
2. Clone this repo and run `npm install`.
3. Run `npm run cap:add:android` — this generates a full native Android
   project in a new `android/` folder.
4. Run `npm run cap:open:android` — opens the project in Android Studio.
5. In Android Studio, generate a signed app bundle (`Build` →
   `Generate Signed Bundle / APK`).
6. Create a [Google Play Console](https://play.google.com/console) account
   ($25 one-time fee) and follow their upload wizard.
7. Fill in the store listing (screenshots, description, privacy policy link
   — required even for a free app), submit for review. Typically approved
   within a day or two.

### For iOS (requires a Mac)

1. You'll need a Mac with [Xcode](https://developer.apple.com/xcode/)
   installed (free), and an [Apple Developer account](https://developer.apple.com/programs/)
   ($99/year — this is Apple's only option, there's no one-time fee).
2. Run `npm run cap:add:ios` — generates a native iOS project in `ios/`.
3. Run `npm run cap:open:ios` — opens it in Xcode.
4. In Xcode, set your Apple Developer team, configure the app icon and
   launch screen, and archive a build for submission.
5. Submit through [App Store Connect](https://appstoreconnect.apple.com/).
   Apple's review typically takes 1-3 days, and is stricter than Google's —
   expect to fill out a privacy "nutrition label" and possibly answer
   follow-up questions about the app's content and purpose.

### A note on app icons

Both stores require several icon sizes. The current site logo (`public/logo.png`)
can be used as a starting point, but for a polished result, plan on having
someone export a clean, properly-sized square icon (ideally 1024x1024
source) before submission — both Xcode and Android Studio have tools that
generate all the required sizes from one source image.

## If you'd rather not deal with Xcode/Android Studio yourself

This is a common enough task that many freelance developers on sites like
Upwork can do the whole "wrap and submit" process for a flat fee, typically
in the $150-500 range for a straightforward Capacitor wrapper like this one
— since all the app logic already exists on the website, there's no real
app development involved, just the packaging and store-submission process.
