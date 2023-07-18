var Typer = {
  text: null,
  accessCountimer: null,
  index: 0, // current cursor position
  speed: 3, // speed of the Typer
  file: 'code.txt', //file, must be setted
  accessCount: 0, //times alt is pressed for Access Granted
  deniedCount: 0, //times caps is pressed for Access Denied
  init: function () {
    // inizialize Hacker Typer
    accessCountimer = setInterval(function () {
      Typer.updLstChr();
    }, 500); // inizialize timer for blinking cursor

    fetch(Typer.file)
      .then((response) => response.text())
      .then((data) => {
        Typer.text = data;
      });
  },

  content: function () {
    return document.querySelector('#console').innerHTML; // get console content
  },

  write: function (str) {
    // append to console content
    document.querySelector('#console').innerHTML =
      document.querySelector('#console').innerHTML + str;
    return false;
  },

  makeAccess: function () {
    //create Access Granted popUp
    Typer.hidepop(); // hide all popups
    Typer.accessCount = 0; //reset count
    document.querySelector('#gran').style.display = 'block';
    return false;
  },

  makeDenied: function () {
    //create Access Denied popUp
    Typer.hidepop(); // hide all popups
    Typer.deniedCount = 0; //reset count
    document.querySelector('#deni').style.display = 'block';
    return false;
  },

  hidepop: function () {
    // hide pop ups
    document.querySelector('#deni').style.display = 'none';
    document.querySelector('#gran').style.display = 'none';
  },
  addText: function (key) {
    //Main function to add the code
    if (key.keyCode == 18) {
      // key 18 = alt key
      Typer.accessCount++; //increase counter
      if (Typer.accessCount >= 3) {
        // if it's presed 3 times
        Typer.makeAccess(); // make access popup
      }
    } else if (key.keyCode == 20) {
      // key 20 = caps lock
      Typer.deniedCount++; // increase counter
      if (Typer.deniedCount >= 3) {
        // if it's pressed 3 times
        Typer.makeDenied(); // make denied popup
      }
    } else if (key.keyCode == 27) {
      // key 27 = esc key
      Typer.hidepop(); // hide all popups
    } else if (key.ctrlKey == true && key.keyCode == '65') {
      // key 65 = A key
      window.open(
        'https://angel.co/l/2xHh3M',
        'Find Start Up Jobs Near You',
        'height=800,width=1200,menubar=1,status=1,scrollbars=1'
      );
    } else if (key.ctrlKey == true && key.keyCode == '66') {
      // key 66 = B key
      window.open(
        'https://belkin.evyy.net/ORAXJK',
        'Belkin: Tech Made Easy',
        'height=800,width=1200,menubar=1,status=1,scrollbars=1'
      );
    } else if (key.ctrlKey == true && key.keyCode == '67') {
      // key 67 = C key
      // 'https://202.redirexit.com/tracking202/redirect/dl.php?t202id=53371&t202kw=dmr1-key',
      // 'Darkmoon Realm MMORPG',
      window.open(
        'https://202.redirexit.com/tracking202/redirect/rtr.php?t202id=63431&t202kw=nmax1-key',
        'Buy Bitcoin Here',
        'height=800,width=1200,menubar=1,status=1,scrollbars=1'
      );
    } else if (key.ctrlKey == true && key.keyCode == '68') {
      // key 68 = D key
      window.open(
        'https://massdrop.7eer.net/b3dLem',
        'Drop.com: Keyboards & Headphones',
        'height=800,width=1200,menubar=1,status=1,scrollbars=1'
      );
    } else if (key.ctrlKey == true && key.keyCode == '69') {
      // key 69 = E key
      window.open(
        'http://visualsitesearch.com',
        'vss',
        'height=800,width=1200,menubar=1,status=1,scrollbars=1'
      );
    } else if (key.ctrlKey == true && key.keyCode == '70') {
      // key 70 = F key
      window.open(
        'http://find-dental-plans.com?t202id=53208',
        'find-dental-plans',
        'height=800,width=1200,menubar=1,status=1,scrollbars=1'
      );
    } else if (key.ctrlKey == true && key.keyCode == '71') {
      // key 71 = G key
      window.open(
        'https://202.redirexit.com/tracking202/redirect/rtr.php?t202id=93499&t202kw=en-redir-key',
        'Enlisted',
        'height=800,width=1200,menubar=1,status=1,scrollbars=1'
      );
    } else if (key.ctrlKey == true && key.keyCode == '72') {
      // key 72 = H key show help
      document.querySelector('.settings').style.display = 'block';
    } else if (key.ctrlKey == true && key.keyCode == '74') {
      // key 74 = J key
      window.open(
        'https://202.redirexit.com/tracking202/redirect/rtr.php?t202id=13559&t202kw=ogx1-key',
        'Opera GX: THe Browser For Gamers',
        'height=800,width=1200,menubar=1,status=1,scrollbars=1'
      );
    } else if (key.ctrlKey == true && key.keyCode == '75') {
      // key 75 = K key
    } else if (key.ctrlKey == true && key.keyCode == '76') {
      // key 76 = L key
      window.open(
        'https://202.redirexit.com/tracking202/redirect/dl.php?t202id=23331&t202kw=wow1-key',
        'World Of Warships',
        'height=800,width=1200,menubar=1,status=1,scrollbars=1'
      );
    } else if (key.ctrlKey == true && key.keyCode == '77') {
      // key 77 = M
      window.open(
        'https://202.redirexit.com/tracking202/redirect/dl.php?t202id=13271&t202kw=li1-key',
        'LinkedIn',
        'height=800,width=1200,menubar=1,status=1,scrollbars=1'
      );
    } else if (key.ctrlKey == true && key.keyCode == '79') {
    } else if (key.ctrlKey == true && key.keyCode == '80') {
      // key 80 = p
      //https://202.redirexit.com/tracking202/redirect/dl.php?t202id=63417&t202kw=vtx1-ley vortex cloud gaming
      window.open(
        'https://202.redirexit.com/tracking202/redirect/dl.php?t202id=63448&t202kw=wowd1-key',
        'World Of Warships',
        'height=800,width=1200,menubar=1,status=1,scrollbars=1'
      );
    } else if (key.ctrlKey == true && key.keyCode == '81') {
      // key 81 = w
    } else if (key.ctrlKey == true && key.keyCode == '82') {
      // key 82 = R key
      window.open(
        'https://tech.ck.page',
        'Develop a Career in Tech!',
        'height=800,width=1200,menubar=1,status=1,scrollbars=1'
      );
    } else if (key.ctrlKey == true && key.keyCode == '83') {
      // key 83 = S key
      //https://act.webull.com/on/IKOCuq76DkaY/t0y/inviteUs/recommend_1343_A_push
      //https://hackertyper.com/sponsor/?utm_source=ht-key      
      //Sponsor HackerTyper
      window.open(
        'https://deals.hackertyper.com/?utm_source=ht-fp',
        'HackerTyper Holiday Game Guide',
        'height=800,width=1200,menubar=1,status=1,scrollbars=1'
      );
    } else if (key.ctrlKey == true && key.keyCode == '82') {
      // key 82 = r key
      window.open(
        'http://amzn.to/S0g0Qg',
        'rby',
        'height=800,width=1200,menubar=1,status=1,scrollbars=1'
      );
    } else if (key.ctrlKey == true && key.keyCode == '83') {
      // key 83 = s key
      window.open(
        'https://202.redirexit.com/tracking202/redirect/dl.php?t202id=83457&t202kw=wotd1-key',
        'World of Tanks',
        'height=800,width=1200,menubar=1,status=1,scrollbars=1'
      );
    } else if (key.ctrlKey == true && key.keyCode == '84') {
      // key 84 = t key
      window.open(
        'https://docutyper.com/?utm_source=ht-key',
        'DocuTyper',
        'height=800,width=1200,menubar=1,status=1,scrollbars=1'
      );
    } else if (Typer.text) {
      // otherway if text is loaded
      var cont = Typer.content(); // get the console content
      if (cont.substring(cont.length - 1, cont.length) == '|')
        // if the last char is the blinking cursor
        document.querySelector('#console').innerHTML = document
          .querySelector('#console')
          .innerHTML.substring(0, cont.length - 1); // remove it before adding the text
      if (key.keyCode != 8) {
        // if key is not backspace
        Typer.index += Typer.speed; // add to the index the speed
      } else {
        if (Typer.index > 0)
          // else if index is not less than 0
          Typer.index -= Typer.speed; //     remove speed for deleting text
      }
      // var text = $('<div/>').text(Typer.text.substring(0, Typer.index)).html(); // parse the text for stripping html enities
      var text = Typer.text.substring(0, Typer.index);
      var rtn = new RegExp('\n', 'g'); // newline regex
      var rts = new RegExp('\\s', 'g'); // whitespace regex
      var rtt = new RegExp('\\t', 'g'); // tab regex

      document.querySelector('#console').innerHTML = text
        .replace(rtn, '<br/>')
        .replace(rtt, '&nbsp;&nbsp;&nbsp;&nbsp;')
        .replace(rts, '&nbsp;');
      // replace newline chars with br, tabs with 4 space and blanks with an html blank
      window.scrollBy(0, 50); // scroll to make sure bottom is always visible
    }
    if (key.preventDefault && key.keyCode != 122) {
      // prevent F11(fullscreen) from being blocked
      key.preventDefault();
    }
    if (key.keyCode != 122) {
      // otherway prevent keys default behavior
      key.returnValue = false;
    }
  },

  updLstChr: function () {
    // blinking cursor
    var cont = this.content(); // get console
    if (cont.substring(cont.length - 1, cont.length) == '|')
      // if last char is the cursor
      document.querySelector('#console').innerHTML = document
        .querySelector('#console')
        .innerHTML.substring(0, cont.length - 1);
    else this.write('|'); // else write it
  },
};

Typer.init();

document.addEventListener('touchstart', (e) => {
  document.querySelector('.settings').style.display = 'none';
  Typer.addText(e); //Capture the tap event for mobileand call the addText, this is executed on page load
});

document.addEventListener('keydown', (e) => {
  document.querySelector('.settings').style.display = 'none';
  Typer.addText(e); //Capture the keydown event and call the addText, this is executed on page load
});

document.querySelector('#showhelp').addEventListener('click', (e) => {
  document.querySelector('.settings').style.display = 'block';
});

document.querySelector('.settings-btn').addEventListener('click', (e) => {
  document.querySelector('.settings').style.display = 'none';
});
