// Made by 3kh0
// https://github.com/3kh0/chill-radio

(this.webpackJsonpcoderadio = this.webpackJsonpcoderadio || []).push([
    [0],
    {
        88: function (t, e, a) {},
        89: function (t, e, a) {
            "use strict";
            a.r(e);
            var n = a(3),
                r = a.n(n),
                i = a(51),
                s = a.n(i),
                o = a(92),
                l = a(58),
                c = a(18),
                u = a(34),
                d = a.n(u),
                h = a(42),
                p = a(25),
                g = a(13),
                f = a(14),
                m = a(17),
                b = a(16),
                v = a(15),
                y = a(52),
                j = a.n(y),
                O = a(53),
                x = a(11),
                S = a(43),
                w = a.n(S),
                C = a(23),
                V = a(59),
                k = a(1);
            function _() {
                var t = Object(n.useState)(!1),
                    e = Object(V.a)(t, 2),
                    a = e[0],
                    r = e[1];
                return Object(k.jsxs)("nav", {
                    className: "site-nav" + (a ? " expand-nav" : ""),
                    id: "site-nav",
                    children: [
                        Object(k.jsx)("div", { className: "site-nav-left" }),
                        Object(k.jsx)("div", {
                            className: "site-nav-middle",
                            children: Object(k.jsx)("a", {
                                className: "site-nav-logo",
                                href: "/chill-radio",
                                children: Object(k.jsx)("img", { alt: "Chill Radio", src: "img/chill-logo.png" }),
                            }),
                        }),
                        Object(k.jsx)("div", {
                            className: "site-nav-right main-nav",
                            children: Object(k.jsx)("div", {
                                className: "main-nav-group",
                                children: Object(k.jsx)("ul", {
                                    className: "nav" + (a ? " show-main-nav-items" : ""),
                                    id: "nav",
                                    children: [
                                        { href: "/", text: "Home" },
                                        { href: "https://github.com/3kh0/chill-radio", text: "GitHub" },
                                    ].map(function (t, e) {
                                        return Object(k.jsx)("li", { children: Object(k.jsx)("a", { href: t.href, rel: "noopener noreferrer", target: "_blank", children: t.text }) }, e);
                                    }),
                                }),
                            }),
                        }),
                        Object(k.jsx)("button", {
                            className: "site-nav-right toggle-button-nav" + (a ? " reverse-toggle-color" : ""),
                            id: "toggle-button-nav",
                            onClick: function () {
                                r(!a);
                            },
                            children: "Menu",
                        }),
                    ],
                });
            }
            var E,
                T,
                P = a(39),
                N = (function (t) {
                    Object(b.a)(a, t);
                    var e = Object(v.a)(a);
                    function a(t) {
                        var n;
                        return (
                            Object(g.a)(this, a),
                            ((n = e.call(this, t)).rafId = null),
                            (n.timerId = null),
                            (n.reset = function () {
                                n.rafId = null;
                            }),
                            (n.startDrawing = function () {
                                n.rafId || (n.rafId = window.requestAnimationFrame(n.drawingLoop));
                            }),
                            (n.stopDrawing = function () {
                                window.cancelAnimationFrame(n.rafId), clearTimeout(n.timerId);
                            }),
                            (n.drawingLoop = function () {
                                var t =
                                    0 !==
                                    n.state.eq.bands.reduce(function (t, e) {
                                        return t + e;
                                    }, 0);
                                n.updateEQBands(), n.drawVisualizer(), t ? (n.rafId = window.requestAnimationFrame(n.drawingLoop)) : (n.timerId = setTimeout(n.drawingLoop, 250));
                            }),
                            (n.handleVisibilityChange = function (t) {
                                n.setState({ isTabVisible: t });
                            }),
                            (n.state = { eq: {}, config: { baseColour: "rgb(10, 10, 35)", translucent: "rgba(10, 10, 35, 0.6)", multiplier: 0.7529 }, isTabVisible: !0 }),
                            n
                        );
                    }
                    return (
                        Object(f.a)(a, [
                            {
                                key: "componentDidUpdate",
                                value: function (t, e) {
                                    var a = this;
                                    (t.playing === this.props.playing && e.isTabVisible === this.state.isTabVisible) ||
                                        (this.props.playing && this.state.isTabVisible
                                            ? (this.state.eq.context || this.initiateEQ(), this.createVisualizer(), this.startDrawing())
                                            : setTimeout(function () {
                                                  a.stopDrawing(), a.reset();
                                              }, 500));
                                },
                            },
                            {
                                key: "initiateEQ",
                                value: function () {
                                    var t = this.state.eq,
                                        e = window.AudioContext || window.webkitAudioContext;
                                    (t.context = new e()),
                                        (t.src = t.context.createMediaElementSource(this.props.player)),
                                        (t.analyser = t.context.createAnalyser()),
                                        t.src.connect(t.analyser),
                                        t.analyser.connect(t.context.destination),
                                        (t.analyser.fftSize = 256),
                                        (t.bands = new Uint8Array(t.analyser.frequencyBinCount - 32)),
                                        this.setState({ eq: t });
                                },
                            },
                            {
                                key: "updateEQBands",
                                value: function () {
                                    var t = this.state.eq;
                                    t.analyser.getByteFrequencyData(t.bands), this.setState({ eq: Object(c.a)({}, t) });
                                },
                            },
                            {
                                key: "createVisualizer",
                                value: function () {
                                    (this._canvas.width = this._canvas.parentNode.offsetWidth),
                                        (this._canvas.height = this._canvas.parentNode.offsetHeight),
                                        (this.visualizer = { ctx: this._canvas.getContext("2d"), height: this._canvas.height, width: this._canvas.width, barWidth: this._canvas.width / this.state.eq.bands.length });
                                },
                            },
                            {
                                key: "drawVisualizer",
                                value: function () {
                                    var t,
                                        e = this,
                                        a = 0;
                                    this.visualizer.ctx.clearRect(0, 0, this.visualizer.width, this.visualizer.height),
                                        this.visualizer.ctx.beginPath(),
                                        this.visualizer.ctx.moveTo(a, 0),
                                        (this.visualizer.ctx.fillStyle = this.state.config.translucent),
                                        this.state.eq.bands.forEach(function (n) {
                                            (t = e.state.config.multiplier * n), e.visualizer.ctx.lineTo(a, t), e.visualizer.ctx.lineTo(a + e.visualizer.barWidth, t), (a += e.visualizer.barWidth);
                                        }),
                                        this.visualizer.ctx.lineTo(a, 0),
                                        this.visualizer.ctx.fill();
                                },
                            },
                            {
                                key: "render",
                                value: function () {
                                    var t = this;
                                    return Object(k.jsx)(P.a, {
                                        onChange: this.handleVisibilityChange,
                                        children: Object(k.jsx)("div", {
                                            className: "visualizer",
                                            children: Object(k.jsx)("canvas", {
                                                "aria-label": "visualizer",
                                                ref: function (e) {
                                                    return (t._canvas = e);
                                                },
                                            }),
                                        }),
                                    });
                                },
                            },
                        ]),
                        a
                    );
                })(r.a.PureComponent),
                I = function (t) {
                    return Object(k.jsxs)("main", {
                        children: [
                            Object(k.jsxs)("div", {
                                className: "under-header-content",
                                children: [Object(k.jsx)("h1", { className: "site-title", children: "Welcome to Chill Radio." }), Object(k.jsx)("h2", { className: "site-description", children: "24/7 music designed for studying/reading/relaxing." })],
                            }),
                            C.isBrowser &&
                                Object(k.jsxs)(k.Fragment, {
                                    children: [
                                        Object(k.jsx)("div", { className: "animation" }),
                                        Object(k.jsx)(N, { player: t.player, playing: t.playing }),
                                        Object(k.jsxs)("details", {
                                            children: [
                                                Object(k.jsx)("summary", { children: "Keyboard Controls" }),
                                                Object(k.jsxs)("dl", {
                                                    children: [
                                                        Object(k.jsx)("dt", { children: "Play/Pause:" }),
                                                        Object(k.jsx)("dd", { children: 'Spacebar or "k"' }),
                                                        Object(k.jsx)("dt", { children: "Volume:" }),
                                                        Object(k.jsx)("dd", { children: "Up Arrow / Down Arrow" }),
                                                    ],
                                                }),
                                            ],
                                        }),
                                    ],
                                }),
                        ],
                    });
                },
                L = function (t) {
                    return Object(k.jsxs)("div", {
                        className: t.playing ? "meta-display thumb meta-display-visible" : "meta-display thumb",
                        children: [
                            Object(k.jsx)("img", { alt: "album art", "data-meta": "picture", src: t.fastConnection ? t.currentSong.art : "img/cover_placeholder.gif" }),
                            Object(k.jsxs)("div", {
                                className: "now-playing",
                                children: [
                                    Object(k.jsx)("div", { className: "progress-container", children: Object(k.jsx)("progress", { "data-meta": "duration", max: t.songDuration, value: t.progressVal }) }),
                                    Object(k.jsx)("div", { "data-meta": "title", children: t.currentSong.title }),
                                    Object(k.jsx)("div", { "data-meta": "artist", children: t.currentSong.artist }),
                                    Object(k.jsx)("div", { "data-meta": "album", children: t.currentSong.album }),
                                    Object(k.jsxs)("div", { "data-meta": "listeners", children: ["Listeners: ", t.listeners] }),
                                    t.mountOptions,
                                ],
                            }),
                        ],
                    });
                },
                M = function (t) {
                    var e = t.currentVolume,
                        a = t.setTargetVolume,
                        n = 100 * e;
                    return Object(k.jsx)("div", {
                        className: "slider-container",
                        children: Object(k.jsx)("input", {
                            "aria-label": "slider",
                            className: "slider",
                            max: 100,
                            min: "0",
                            onChange: function (t) {
                                var e = t.target.value;
                                a(e / 100);
                            },
                            type: "range",
                            value: n,
                        }),
                    });
                },
                D = ["title", "titleId"];
            function A() {
                return (A =
                    Object.assign ||
                    function (t) {
                        for (var e = 1; e < arguments.length; e++) {
                            var a = arguments[e];
                            for (var n in a) Object.prototype.hasOwnProperty.call(a, n) && (t[n] = a[n]);
                        }
                        return t;
                    }).apply(this, arguments);
            }
            function U(t, e) {
                if (null == t) return {};
                var a,
                    n,
                    r = (function (t, e) {
                        if (null == t) return {};
                        var a,
                            n,
                            r = {},
                            i = Object.keys(t);
                        for (n = 0; n < i.length; n++) (a = i[n]), e.indexOf(a) >= 0 || (r[a] = t[a]);
                        return r;
                    })(t, e);
                if (Object.getOwnPropertySymbols) {
                    var i = Object.getOwnPropertySymbols(t);
                    for (n = 0; n < i.length; n++) (a = i[n]), e.indexOf(a) >= 0 || (Object.prototype.propertyIsEnumerable.call(t, a) && (r[a] = t[a]));
                }
                return r;
            }
            function F(t, e) {
                var a = t.title,
                    r = t.titleId,
                    i = U(t, D);
                return n.createElement(
                    "svg",
                    A({ viewBox: "0 0 640 640", fill: "currentColor", ref: e, "aria-labelledby": r }, i),
                    void 0 === a ? n.createElement("title", { id: r }, "Pause Button") : a ? n.createElement("title", { id: r }, a) : null,
                    E || (E = n.createElement("path", { d: "M0 0L235.67 0L235.67 640L0 640L0 0Z" })),
                    T || (T = n.createElement("path", { d: "M404.33 0L640 0L640 640L404.33 640L404.33 0Z" }))
                );
            }
            var z,
                R = n.forwardRef(F),
                q = (a.p, ["title", "titleId"]);
            function B() {
                return (B =
                    Object.assign ||
                    function (t) {
                        for (var e = 1; e < arguments.length; e++) {
                            var a = arguments[e];
                            for (var n in a) Object.prototype.hasOwnProperty.call(a, n) && (t[n] = a[n]);
                        }
                        return t;
                    }).apply(this, arguments);
            }
            function H(t, e) {
                if (null == t) return {};
                var a,
                    n,
                    r = (function (t, e) {
                        if (null == t) return {};
                        var a,
                            n,
                            r = {},
                            i = Object.keys(t);
                        for (n = 0; n < i.length; n++) (a = i[n]), e.indexOf(a) >= 0 || (r[a] = t[a]);
                        return r;
                    })(t, e);
                if (Object.getOwnPropertySymbols) {
                    var i = Object.getOwnPropertySymbols(t);
                    for (n = 0; n < i.length; n++) (a = i[n]), e.indexOf(a) >= 0 || (Object.prototype.propertyIsEnumerable.call(t, a) && (r[a] = t[a]));
                }
                return r;
            }
            function K(t, e) {
                var a = t.title,
                    r = t.titleId,
                    i = H(t, q);
                return n.createElement(
                    "svg",
                    B({ viewBox: "0 0 640 640", fill: "#fff", ref: e, "aria-labelledby": r }, i),
                    void 0 === a ? n.createElement("title", { id: r }, "Play Button") : a ? n.createElement("title", { id: r }, a) : null,
                    z || (z = n.createElement("path", { d: "M0 0L649.1 320L0 640L0 0Z" }))
                );
            }
            var W = n.forwardRef(K),
                G =
                    (a.p,
                    (function (t) {
                        Object(b.a)(a, t);
                        var e = Object(v.a)(a);
                        function a() {
                            var t;
                            Object(g.a)(this, a);
                            for (var n = arguments.length, r = new Array(n), i = 0; i < n; i++) r[i] = arguments[i];
                            return (
                                ((t = e.call.apply(e, [this].concat(r))).state = { initialLoad: !0 }),
                                (t.handleOnClick = function () {
                                    return C.isBrowser && t.props.togglePlay();
                                }),
                                (t.handleOnTouchEnd = function () {
                                    return !C.isBrowser && t.props.togglePlay();
                                }),
                                (t.handleKeyDown = function (e) {
                                    13 === e.keyCode && t.handleOnClick();
                                }),
                                t
                            );
                        }
                        return (
                            Object(f.a)(
                                a,
                                [
                                    {
                                        key: "render",
                                        value: function () {
                                            return Object(k.jsx)("button", {
                                                "aria-label": this.props.playing ? "Pause" : "Play",
                                                className: this.state.initialLoad ? "play-container-cta play-container" : "play-container",
                                                id: "playContainer",
                                                onClick: this.handleOnClick,
                                                onKeyDown: this.handleKeyDown,
                                                onTouchEnd: this.handleOnTouchEnd,
                                                children: this.props.playing ? Object(k.jsx)(R, {}) : Object(k.jsx)(W, {}),
                                            });
                                        },
                                    },
                                ],
                                [
                                    {
                                        key: "getDerivedStateFromProps",
                                        value: function (t, e) {
                                            return e.initialLoad && t.playing ? { initialLoad: !1 } : null;
                                        },
                                    },
                                ]
                            ),
                            a
                        );
                    })(r.a.Component)),
                Q = a(54),
                J = a(55),
                Y = (function (t) {
                    Object(b.a)(a, t);
                    var e = Object(v.a)(a);
                    function a(t) {
                        var n;
                        return (
                            Object(g.a)(this, a),
                            ((n = e.call(this, t)).toggleDisplay = function () {
                                n.setState({ displayList: !n.state.displayList });
                            }),
                            (n.state = { displayList: !1 }),
                            n
                        );
                    }
                    return (
                        Object(f.a)(a, [
                            {
                                key: "render",
                                value: function () {
                                    var t = this.props,
                                        e = t.songHistory,
                                        a = t.fastConnection,
                                        n = e
                                            .map(function (t) {
                                                return t.song;
                                            })
                                            .reverse();
                                    return Object(k.jsxs)("button", {
                                        "aria-label": "Recent Song History",
                                        className: "recent-song-history",
                                        onClick: this.toggleDisplay,
                                        children: [
                                            this.state.displayList &&
                                                Object(k.jsx)("div", {
                                                    className: "recent-song-list",
                                                    children: n.map(function (t) {
                                                        return Object(k.jsxs)(
                                                            "div",
                                                            {
                                                                className: "recent-song-info",
                                                                children: [
                                                                    Object(k.jsx)("img", { alt: "", role: "presentation", src: a ? t.art : "img/cover_placeholder.gif" }),
                                                                    Object(k.jsxs)("div", {
                                                                        className: "recent-song-meta",
                                                                        children: [Object(k.jsx)("p", { children: t.title }), Object(k.jsxs)("p", { children: [" ", t.artist] }), Object(k.jsxs)("p", { children: [" ", t.album] })],
                                                                    }),
                                                                ],
                                                            },
                                                            t.id
                                                        );
                                                    }),
                                                }),
                                            Object(k.jsx)(Q.a, { className: "recently-played-icon", icon: J.a }),
                                        ],
                                    });
                                },
                            },
                        ]),
                        a
                    );
                })(n.Component),
                Z = (function (t) {
                    Object(b.a)(a, t);
                    var e = Object(v.a)(a);
                    function a(t) {
                        var n;
                        return (
                            Object(g.a)(this, a),
                            ((n = e.call(this, t)).handleVisibilityChange = function (t) {
                                n.setState({ isTabVisible: t }, function () {
                                    n.toggleInterval();
                                });
                            }),
                            (n.state = { progressVal: 0, currentSong: {}, progressInterval: null, alternativeMounts: null, isTabVisible: !0 }),
                            (n.updateProgress = n.updateProgress.bind(Object(m.a)(n))),
                            n
                        );
                    }
                    return (
                        Object(f.a)(a, [
                            {
                                key: "componentDidUpdate",
                                value: function (t) {
                                    this.state.currentSong.id !== t.currentSong.id && this.props.songStartedAt && this.props.playing
                                        ? (this.setState({ currentSong: this.props.currentSong, alternativeMounts: [].concat(this.props.remotes, this.props.mounts) }), this.toggleInterval())
                                        : t.playing !== this.props.playing && this.toggleInterval();
                                },
                            },
                            {
                                key: "startInterval",
                                value: function () {
                                    this.stopCurrentInterval(), this.setState({ progressInterval: setInterval(this.updateProgress, 100) });
                                },
                            },
                            {
                                key: "stopCurrentInterval",
                                value: function () {
                                    this.state.progressInterval && clearInterval(this.state.progressInterval);
                                },
                            },
                            {
                                key: "toggleInterval",
                                value: function () {
                                    this.props.playing && this.state.isTabVisible ? this.startInterval() : this.stopCurrentInterval();
                                },
                            },
                            {
                                key: "updateProgress",
                                value: function () {
                                    var t = parseInt(((new Date().valueOf() - this.props.songStartedAt) / 1e3).toFixed(2), 10);
                                    this.setState({ progressVal: t });
                                },
                            },
                            {
                                key: "handleChange",
                                value: function (t) {
                                    var e = t.target.value;
                                    this.props.setUrl(e);
                                },
                            },
                            {
                                key: "getMountOptions",
                                value: function () {
                                    var t = "",
                                        e = this.state.alternativeMounts;
                                    return (
                                        e &&
                                            this.props.url &&
                                            (t = Object(k.jsx)("select", {
                                                "aria-label": "Select Stream",
                                                "data-meta": "stream-select",
                                                onChange: this.handleChange.bind(this),
                                                value: this.props.url,
                                                children: e.map(function (t, e) {
                                                    return Object(k.jsx)("option", { value: t.url, children: t.name }, e);
                                                }),
                                            })),
                                        t
                                    );
                                },
                            },
                            {
                                key: "render",
                                value: function () {
                                    var t = this.state,
                                        e = t.progressVal,
                                        a = t.currentSong,
                                        n = t.isTabVisible,
                                        r = this.props,
                                        i = r.playing,
                                        s = r.songDuration,
                                        o = r.togglePlay,
                                        l = r.currentVolume,
                                        c = r.setTargetVolume,
                                        u = r.listeners,
                                        d = r.fastConnection;
                                    return Object(k.jsx)(P.a, {
                                        onChange: this.handleVisibilityChange,
                                        children: Object(k.jsxs)("footer", {
                                            children: [
                                                n && Object(k.jsx)(Y, { songHistory: this.props.songHistory, fastConnection: d }),
                                                Object(k.jsx)(L, { currentSong: a, progressVal: e, fastConnection: d, listeners: u, mountOptions: this.getMountOptions(), playing: i, songDuration: s }),
                                                Object(k.jsx)(G, { playing: i, togglePlay: o }),
                                                Object(k.jsx)(M, { currentVolume: l, setTargetVolume: c }),
                                            ],
                                        }),
                                    });
                                },
                            },
                        ]),
                        a
                    );
                })(r.a.PureComponent),
                X = (a(88), new j.a("wss://coderadio-admin.freecodecamp.org/api/live/nowplaying/coderadio")),
                $ = "coderadio-volume";
            X.on("error", function (t, e) {
                x.a({ message: "Error! NchanSubscriber error: " + e }), x.b(t);
            });
            var tt = (function (t) {
                Object(b.a)(a, t);
                var e = Object(v.a)(a);
                function a(t) {
                    var n;
                    return (
                        Object(g.a)(this, a),
                        ((n = e.call(this, t)).sortStreams = function (t) {
                            var e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
                                a = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
                            if (a) {
                                var n = t.map(function (t) {
                                        return t.bitrate;
                                    }),
                                    r = Math.max.apply(Math, Object(p.a)(n));
                                return t
                                    .filter(function (t) {
                                        return e ? t.bitrate !== r : t.bitrate === r;
                                    })
                                    .sort(function () {
                                        return Math.random() - 0.5;
                                    });
                            }
                            return t.sort(function (t, a) {
                                if (e) {
                                    if (parseFloat(t.bitrate) < parseFloat(a.bitrate)) return -1;
                                    if (parseFloat(t.bitrate) > parseFloat(a.bitrate)) return 1;
                                } else {
                                    if (parseFloat(t.bitrate) < parseFloat(a.bitrate)) return 1;
                                    if (parseFloat(t.bitrate) > parseFloat(a.bitrate)) return -1;
                                }
                                return t.listeners.current < a.listeners.current ? -1 : t.listeners.current > a.listeners.current ? 1 : 0;
                            });
                        }),
                        (n.getStreamUrl = function (t, e) {
                            return n.sortStreams(t, e, !0)[0].url;
                        }),
                        (n.increaseVolume = function () {
                            return n.setTargetVolume(Math.min(n.state.audioConfig.maxVolume + n.state.audioConfig.volumeSteps, 1));
                        }),
                        (n.decreaseVolume = function () {
                            return n.setTargetVolume(Math.max(n.state.audioConfig.maxVolume - n.state.audioConfig.volumeSteps, 0));
                        }),
                        (n.onPlayerError = Object(h.a)(
                            d.a.mark(function t() {
                                var e, a, r, i, s, o, l, c, u, h;
                                return d.a.wrap(function (t) {
                                    for (;;)
                                        switch ((t.prev = t.next)) {
                                            case 0:
                                                if (n.state.playing || n._player.src) {
                                                    t.next = 2;
                                                    break;
                                                }
                                                return t.abrupt("return");
                                            case 2:
                                                if (
                                                    ((e = n.state),
                                                    (a = e.mounts),
                                                    (r = e.remotes),
                                                    (i = e.erroredStreams),
                                                    (s = e.url),
                                                    (o = n.sortStreams([].concat(Object(p.a)(r), Object(p.a)(a)))),
                                                    (l = o.find(function (t) {
                                                        return t.url === s;
                                                    })),
                                                    (c = i.some(function (t) {
                                                        return t.url === s;
                                                    })),
                                                    (u = c ? i : [].concat(Object(p.a)(i), [l])).length !== o.length)
                                                ) {
                                                    t.next = 11;
                                                    break;
                                                }
                                                return (t.next = 10), n.pause();
                                            case 10:
                                                return t.abrupt("return");
                                            case 11:
                                                (h = o
                                                    .filter(function (t) {
                                                        return !u.some(function (e) {
                                                            return e.url === t.url;
                                                        });
                                                    })
                                                    .map(function (t) {
                                                        return t.url;
                                                    })),
                                                    c
                                                        ? n.setUrl(h[0])
                                                        : n.setState({ erroredStreams: u }, function () {
                                                              return n.setUrl(h[0]);
                                                          });
                                            case 13:
                                            case "end":
                                                return t.stop();
                                        }
                                }, t);
                            })
                        )),
                        (n.state = {
                            config: { metadataTimer: 1e3 },
                            fastConnection: !!navigator.connection && navigator.connection.downlink > 1.5,
                            eq: {},
                            visualizer: {},
                            audioConfig: { targetVolume: 0, maxVolume: 0.5, volumeSteps: 0.01, currentVolume: 0.5, volumeTransitionSpeed: 10 },
                            url: "",
                            mounts: [],
                            remotes: [],
                            playing: null,
                            captions: null,
                            pausing: null,
                            pullMeta: !1,
                            erroredStreams: [],
                            currentSong: {},
                            songStartedAt: 0,
                            songDuration: 0,
                            listeners: 0,
                            songHistory: [],
                        }),
                        (n.keyMap = { TOGGLE_PLAY: ["space", "k"], INCREASE_VOLUME: "up", DECREASE_VOLUME: "down" }),
                        (n.handlers = {
                            TOGGLE_PLAY: function () {
                                return n.togglePlay();
                            },
                            INCREASE_VOLUME: function () {
                                return n.increaseVolume();
                            },
                            DECREASE_VOLUME: function () {
                                return n.decreaseVolume();
                            },
                        }),
                        (n.togglePlay = n.togglePlay.bind(Object(m.a)(n))),
                        (n.setUrl = n.setUrl.bind(Object(m.a)(n))),
                        (n.setTargetVolume = n.setTargetVolume.bind(Object(m.a)(n))),
                        (n.getNowPlaying = n.getNowPlaying.bind(Object(m.a)(n))),
                        (n.updateVolume = n.updateVolume.bind(Object(m.a)(n))),
                        n
                    );
                }
                return (
                    Object(f.a)(a, [
                        {
                            key: "setPlayerInitial",
                            value: function () {
                                var t = this,
                                    e = w.a.get($) || this.state.audioConfig.maxVolume;
                                this.setState({ audioConfig: Object(c.a)(Object(c.a)({}, this.state.audioConfig), {}, { maxVolume: e, currentVolume: e }) }, function () {
                                    t._player.volume = e;
                                });
                            },
                        },
                        {
                            key: "componentDidMount",
                            value: function () {
                                this.setPlayerInitial(), this.getNowPlaying();
                            },
                        },
                        {
                            key: "setUrl",
                            value: (function () {
                                var t = Object(h.a)(
                                    d.a.mark(function t() {
                                        var e,
                                            a = arguments;
                                        return d.a.wrap(
                                            function (t) {
                                                for (;;)
                                                    switch ((t.prev = t.next)) {
                                                        case 0:
                                                            if ((e = a.length > 0 && void 0 !== a[0] && a[0])) {
                                                                t.next = 3;
                                                                break;
                                                            }
                                                            return t.abrupt("return");
                                                        case 3:
                                                            if (!this.state.playing) {
                                                                t.next = 6;
                                                                break;
                                                            }
                                                            return (t.next = 6), this.pause();
                                                        case 6:
                                                            (this._player.src = e), this.setState({ url: e }), null !== this.state.playing && this.play();
                                                        case 9:
                                                        case "end":
                                                            return t.stop();
                                                    }
                                            },
                                            t,
                                            this
                                        );
                                    })
                                );
                                return function () {
                                    return t.apply(this, arguments);
                                };
                            })(),
                        },
                        {
                            key: "play",
                            value: function () {
                                var t = this,
                                    e = this.state,
                                    a = e.mounts,
                                    n = e.remotes;
                                e.playing ||
                                    (X.running || X.start(),
                                    Array.from([].concat(Object(p.a)(a), Object(p.a)(n)), function (t) {
                                        return t.url;
                                    }).includes(this._player.src) || ((this._player.src = this.state.url), this._player.load()),
                                    (this._player.volume = 0),
                                    this._player.play().then(function () {
                                        t.setState(function (t) {
                                            return { audioConfig: Object(c.a)(Object(c.a)({}, t.audioConfig), {}, { currentVolume: 0 }), playing: !0, pullMeta: !0 };
                                        }),
                                            t.fadeUp();
                                    }));
                            },
                        },
                        {
                            key: "pause",
                            value: function () {
                                var t = this;
                                return this.state.playing
                                    ? new Promise(function (e) {
                                          t._player.pause(),
                                              t._player.load(),
                                              t.setState({ playing: !1, pausing: !1 }, function () {
                                                  X.stop(), e();
                                              });
                                      })
                                    : Promise.resolve();
                            },
                        },
                        {
                            key: "togglePlay",
                            value: function () {
                                this._player.src && (this.state.playing ? this.fadeDown() : this.play());
                            },
                        },
                        {
                            key: "setTargetVolume",
                            value: function (t) {
                                var e = Object(c.a)({}, this.state.audioConfig),
                                    a = parseFloat(Math.max(0, Math.min(1, t).toFixed(2)));
                                (e.maxVolume = a),
                                    (e.currentVolume = a),
                                    (this._player.volume = e.maxVolume),
                                    this.setState({ audioConfig: e }, function () {
                                        w.a.set($, a);
                                    });
                            },
                        },
                        {
                            key: "fade",
                            value: function (t) {
                                var e = Object(c.a)({}, this.state.audioConfig);
                                (e.targetVolume = "up" === t.toLowerCase() ? this.state.audioConfig.maxVolume : 0), this.setState({ audioConfig: e, pausing: "down" === t }, this.updateVolume);
                            },
                        },
                        {
                            key: "fadeUp",
                            value: function () {
                                this.fade("up");
                            },
                        },
                        {
                            key: "fadeDown",
                            value: function () {
                                this.fade("down");
                            },
                        },
                        {
                            key: "updateVolume",
                            value: function () {
                                if (parseFloat(this._player.volume.toFixed(2)) === this.state.audioConfig.targetVolume || C.isIOS) 0 === this.state.audioConfig.targetVolume && this.state.pausing && this.pause();
                                else {
                                    var t = Math.min(this.state.audioConfig.volumeSteps, Math.abs(this.state.audioConfig.targetVolume - this._player.volume)),
                                        e = this.state.audioConfig.targetVolume > this._player.volume ? t : -t;
                                    this._player.volume += e;
                                    var a = this.state.audioConfig;
                                    (a.currentVolume += e), this.setState({ audioConfig: a }), setTimeout(this.updateVolume, this.state.audioConfig.volumeTransitionSpeed);
                                }
                            },
                        },
                        {
                            key: "setMountToConnection",
                            value: function () {
                                var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
                                    e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [],
                                    a = null;
                                (a =
                                    !1 === this.state.fastConnection && e.length > 0
                                        ? this.getStreamUrl(e, !0)
                                        : this.state.fastConnection && e.length > 0
                                        ? this.getStreamUrl(e)
                                        : !1 === this.state.fastConnection
                                        ? this.getStreamUrl(t, !0)
                                        : this.getStreamUrl(t)),
                                    (this._player.src = a),
                                    this.setState({ url: a });
                            },
                        },
                        {
                            key: "getNowPlaying",
                            value: function () {
                                var t = this;
                                X.on("message", function (e) {
                                    var a = JSON.parse(e);
                                    "" === t.state.url && (t.setState({ mounts: a.station.mounts, remotes: a.station.remotes }), t.setMountToConnection(a.station.mounts, a.station.remotes)),
                                        t.state.listeners !== a.listeners.current && t.setState({ listeners: a.listeners.current }),
                                        (a.now_playing.song.id !== t.state.currentSong.id || t.state.pullMeta) &&
                                            t.setState({ currentSong: a.now_playing.song, songStartedAt: 1e3 * a.now_playing.played_at, songDuration: a.now_playing.duration, pullMeta: !1, songHistory: a.song_history });
                                }),
                                    (X.reconnectTimeout = this.state.config.metadataTimer),
                                    X.start();
                            },
                        },
                        {
                            key: "render",
                            value: function () {
                                var t = this;
                                return Object(k.jsx)(O.GlobalHotKeys, {
                                    handlers: this.handlers,
                                    keyMap: this.keyMap,
                                    children: Object(k.jsxs)("div", {
                                        className: "App",
                                        children: [
                                            Object(k.jsx)(_, {}),
                                            Object(k.jsx)(I, { fastConnection: this.state.fastConnection, player: this._player, playing: this.state.playing }),
                                            Object(k.jsx)("audio", {
                                                "aria-label": "audio",
                                                crossOrigin: "anonymous",
                                                onError: this.onPlayerError,
                                                ref: function (e) {
                                                    return (t._player = e);
                                                },
                                                children: Object(k.jsx)("track", Object(c.a)({ kind: "captions" }, this.state.captions)),
                                            }),
                                            Object(k.jsx)(Z, {
                                                currentSong: this.state.currentSong,
                                                currentVolume: this.state.audioConfig.currentVolume,
                                                fastConnection: this.state.fastConnection,
                                                listeners: this.state.listeners,
                                                mounts: this.state.mounts,
                                                playing: this.state.playing,
                                                remotes: this.state.remotes,
                                                setTargetVolume: this.setTargetVolume,
                                                setUrl: this.setUrl,
                                                songDuration: this.state.songDuration,
                                                songHistory: this.state.songHistory,
                                                songStartedAt: this.state.songStartedAt,
                                                togglePlay: this.togglePlay,
                                                url: this.state.url,
                                            }),
                                        ],
                                    }),
                                });
                            },
                        },
                    ]),
                    a
                );
            })(r.a.Component);
            o.a({
                dsn: Object({ NODE_ENV: "production", PUBLIC_URL: "", WDS_SOCKET_HOST: void 0, WDS_SOCKET_PATH: void 0, WDS_SOCKET_PORT: void 0, FAST_REFRESH: !0 }).REACT_APP_SENTRY_DSN,
                integrations: [new l.a.BrowserTracing()],
                tracesSampleRate: 1,
            }),
                s.a.render(Object(k.jsx)(tt, {}), document.getElementById("root"));
        },
    },
    [[89, 1, 2]],
]);
