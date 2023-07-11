SharkGame.OverlayHandler = {
    init() {
        $(`#overlay`).removeClass(`gateway`);
    },

    setup() {},

    revealOverlay(duration, endOpacity, callback = $.noop) {
        if (duration === 0 || !SharkGame.Settings.current.showAnimations) {
            $(`#overlay`).css(`opacity`, endOpacity).show();
            callback();
        } else {
            if ($(`#overlay`).is(`:hidden`)) {
                $(`#overlay`).css(`opacity`, 0).show();
            }
            $(`#overlay`).animate(
                {
                    opacity: endOpacity,
                },
                duration,
                "swing",
                callback
            );
        }
    },

    hideOverlay(duration = 0, callback = $.noop) {
        if (duration === 0 || !SharkGame.Settings.current.showAnimations) {
            $(`#overlay`).css(`opacity`, 0).hide();
            callback();
        } else {
            $(`#overlay`).animate(
                {
                    opacity: 0,
                },
                duration,
                "swing",
                () => {
                    callback();
                    $(`#overlay`).hide();
                }
            );
        }
    },

    isOverlayShown() {
        return !$(`#overlay`).is(`:hidden`) && $(`#overlay`).css(`opacity`) !== 0;
    },

    enterGateway() {
        $(`#overlay`).addClass(`gateway`);
    },

    exitGateway() {
        $(`#overlay`).removeClass(`gateway`);
    },
};
