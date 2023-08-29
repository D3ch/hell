const say = [
    "Go to hell",
    "best unblocked games tbh",
    "imagine using this during class",
    "coolmath games can only WISH to be me",
    "hell lowk better",
    "why u looking here go play smt",
    "f;dalkjf;lakhg;lshjtlsjhdf",
    "i <3 typing rando things in javascript",
    "the comma key looks like a comma",
    "xd xd xd xd",
    "you look like a CHAIR",
    "making my way downtown. walking fast, pace is fast",
    "reminder to stay hydrated",
    "the best unblocked games",
    "unblocked games idk",
    "as;ldkfjsdflkjasdflkjhhhhhh",
    "subscribe to https://www.youtube.com/channel/UCJu-mj7edKPYsShEAqRWDXQ",
    "check my git -> github.com/d3ch",
    "alloy proxy doesn't have safesearch 🤯",
    "this sites sponser is (i dont have a sponser :c)",
    "totally didn't run out of subtitles at this point",
    "hellv3.netlify.app",
    "skull",
    "i have a dreeam thate onday nomor blkco stff",
    "subtle subtitle same thing",
    "github carrying this site",
    "shoutout to those who created html",
    "336 dimples are on a single golf ball i think",
    "i may or may not have stolen this from https://lioxryt.github.io/",
    "'play pokemon dont js sit there' - sm drunk dude in walmart",
    "the world is ending and i cant stop crying over these frog boots",
    "this is a subtitle",
    "hell is js better ",
    "how did you get here???",
    "chat gpt is chat gpt",
    "there are 13 half steps in octave",
    "use hell",
    "im not out of subtitles you're out of subtitles",
    "he1l.netlify.app",
    "made by dachxd",
    "balisong flipping is fun you should try it",
    "'go to hell!' sm goofy ahh person",
    "fun fact i dont care if you read these",
    "its not wasting your life if you enjoy it",
    "lifes short go and do smt stupid",
    "imagine spending hours on github",
    "'oh it takes money to host this' - sm dude hosting it on a free hosting site",
    "im not adding roblox touch grass",
    "c's get degrees a's and b's succeed",
    "tap me for a random subtitle",
    "sometimes i wonder why i write code knowing some day its not gonna matter",
    "october 12",
    "you should do something productive like playing run 3 or smt",
    "sometimes i wonder why we exist",
    "hell = unblocked games. remember that",
    "you dont deserve a subtitle",
    "unblocked searching or smt idrc",
    "reading this means Hell officially has 220+ games",
    "im broke",
    "hell 🔛🔝",
    "i started hell one day cuz sm told me that i should go to hell",
    "wooooooooooooooooooooooooooo",
    "chimfkfen fjcsdk nugest",
    "prob 2nd best game site idk",
    "stop procastinating",
    "i should add ads",
    "want a game thats n ot there? clikc recommendation",
    "Html, flash, gameboy, and even IO games. Who would be bored?",
    "blocked? Go on instances.d3ch.repl.co",
    "i think im going insane",
    "eggo waffles and nutella tastes good 💯",
    "we have run 3 and gameboy games we the best music",
    "say sofa king out loud",
    "chat gpt may or may not have written the javascript here",
    "hell >>>>",
    "search the web using search (safe search is on)",
    "we the best music",
    "if this ever gets blocked, go to hellv3.netlify.app",
    "fried chicken on top",
    "cant gurantee that chat gpt chat gpt",
    "life is roblox - dj khalid", 
    "got loads of stuff",
    "eh",
    "check out the new apps page!",
    "Thank you for over 10k view ♥!",
    "sorry for the slow proxy. Changed bare it should be faster.",
    "dance !",
    "check out the new UI for games!",
    "wow im surprsed if someone acc reads these",
    "please dont sue me",
    "stay low in a tesla",
    "do people read these?",
    "check out the new apps ui!",
    "if you're gonna use this site, u'll need at least 2 brain cells",
  ];
  /*
  hi skidder or person looking at my code
  
  stole this code from https://lioxryt.github.io/

  plez dont sue
  
  
    they're site cool u shd check them out

    please dont sue me
  */
  
  
  const changeSub = (num) => {
    document.getElementById("subtitle").innerHTML = say[num];
  };
  
  const newSub = () => {
    const howmany = say.length;
    const bRand = Math.floor(Math.random() * howmany);
    const sayWhat = say[bRand];
    document.getElementById("subtitle").innerHTML = sayWhat;
  };
  
  newSub();
  
  const changeSplash = (num) => {
    const subtitle = say[num];
    document.getElementById("subtitle").innerHTML = subtitle;
    const ret = `Set current splash to splash ${num}, ${subtitle}`;
    return ret;
  };