# Haste

Sharing code is a good thing, and it should be _really_ easy to do it.
A lot of times, I want to show you something I'm seeing - and that's where we
use pastebins.

Haste is the prettiest, easiest to use pastebin ever made.

## Basic Usage

Type what you want me to see, click "Save", and then copy the URL. Send that
URL to someone and they'll see what you see.

To make a new entry, click "New" (or type 'control + n')

## From the Console

Most of the time I want to show you some text, it's coming from my current
console session. We should make it really easy to take code from the console
and send it to people.

`cat something | haste` # https://hastebin.skyra.pw/1238193

You can even take this a step further, and cut out the last step of copying the
URL with:

-   osx: `cat something | haste | pbcopy`
-   linux: `cat something | haste | xsel`
-   windows: check out [WinHaste](https://github.com/ajryan/WinHaste)

After running that, the STDOUT output of `cat something` will show up at a URL
which has been conveniently copied to your clipboard.

That's all there is to that, and you can install it with `gem install haste`
right now.

-   osx: you will need to have an up to date version of Xcode
-   linux: you will need to have rubygems and ruby-devel installed

## Duration

Pastes will stay for 6 hours from their last view. They may be removed earlier
and without notice.
