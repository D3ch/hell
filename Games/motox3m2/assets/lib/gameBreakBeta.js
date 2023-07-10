window.adsbygoogle = window.adsbygoogle || [];
const adBreak = adConfig = function(o) {
    adsbygoogle.push(o);
}
adConfig({
    preloadAdBreaks: 'on',
    sound: 'on', // This game has sound
    onReady: () => {
        console.log("ready");
    }, // Called when API has initialised and adBreak() is ready
});

function showNextAd() {
    console.log("showNextAd")
    adBreak({
        type: 'start',
        name: 'start-game',
        beforeAd: () => {
            pauseGame()
        }, // You may also want to mute thegame's sound.
        afterAd: () => {
            resumeGame()
        }, // resume the game flow.
        adBreakDone: (placementInfo) => {
            console.log("adBreak complete ");
            console.log(placementInfo.breakType);
            console.log(placementInfo.breakName);
            console.log(placementInfo.breakFormat);
            console.log(placementInfo.breakStatus);
        },
    });
}

function pauseGame() {
    //PauseGame Code
    myDispatchEvent('sdk_mute');
}

function resumeGame() {
    //resume Game Code
    myDispatchEvent('sdk_unmute');
}