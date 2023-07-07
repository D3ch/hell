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
    "walking my way downtown walking fast pace is fast",
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
    "hell2.gq",
  ];
  /*
  hi skidder or person looking at my code
  
  I STOLE THIS CODE FROM https://lioxryt.github.io/

  plez dont sue
  
  
    they're site cool u shd check them out
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