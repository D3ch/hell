const TIME_BETWEEN_PROMOS_SECONDS = 1209600; //2 weeks
const CURRENTLY_ACTIVE_PROMO_ID = "MMAndroid";

//To Save
var lastTimeSeenPromo = 0;
var promosClicked = [];

function isPlayerReadyForPromo()
{
    return playtime > 10800 &&
        CURRENTLY_ACTIVE_PROMO_ID != "" &&
        secondsSinceLastPromoSeen() > TIME_BETWEEN_PROMOS_SECONDS &&
        !promosClicked.includes(CURRENTLY_ACTIVE_PROMO_ID) &&
        numGameLaunches >= 3 &&
        !isMobile();
}

function secondsSinceLastPromoSeen()
{
    return (currentTime() - lastTimeSeenPromo) / 1000;
}