/**
 * @file director.class.js
 * @version 1.1.0
 * @license MIT License
 * Copyright 2020 Donitz
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 * associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
 * NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import AudioManager from '../core/audiomanager.class.js';
import Entity from '../core/entity.class.js';
import Options from '../core/options.class.js';

import * as THREE from '../lib/three.js/three.module.js';

export default class Director extends Entity {
    constructor(context, scene, options) {
        options = Options.castIfRequired(options);

        options.set('updatePriority', 4);

        super(context, scene, options);

        const tScene = scene.getThreeScene();

        this._gameClient = context.gameClient;

        this._player = scene.findEntityOfType(Entity.getTypeByName('Player'));
        this._computer = scene.findEntityOfType(Entity.getTypeByName('Computer'));
        this._maze = scene.findEntityOfType(Entity.getTypeByName('Maze'));
        this._transition = scene.findEntityOfType(Entity.getTypeByName('Transition'));
        this._monster = scene.findEntityOfType(Entity.getTypeByName('Monster'));
        this._world = scene.findEntityOfType(Entity.getTypeByName('World'));

        this._eventUsed = new Set();

        this._startPhase(context, 0);

        AudioManager.asyncPlaySilenceOnUserGesture()
            .then(() => {
                this._computer.playAmbient();
            });
    }

    _startPhase(context, index) {
        switch (index) {
            case 0:
                this._player.setFovLevel(0);

                this._maze.startLevel(index, () => {
                    this._gameClient.hideTitle();

                    this._player.setFovLevel(1);

                    context.time.setTimeout(() => {
                        this._startPhase(context, index + 1);
                    }, 500);
                }, eventName => this._playEvent(context, eventName));

                break;

            case 1:
                this._maze.startLevel(index, () => {
                    this._computer.showNoise(0.5, 0, 1);

                    context.time.setTimeout(() => {
                        this._transition.playAction(context, 'enter', () => this._startPhase(context, index + 1));
                    }, 500);
                }, eventName => this._playEvent(context, eventName));

                break;

            case 2:
                this._maze.startLevel(index, () => {
                    this._startPhase(context, index + 1);
                }, eventName => this._playEvent(context, eventName));

                break;

            case 18:
            case 17:
                this._player.setFovLevel(2);
            case 16:
                this._maze.startLevel(index, transitionType => {
                    switch (transitionType) {
                        case 'lose':
                            this._player.jump(0.04);
                            this._computer.showNoise(0.5, 0, 0.5, 0, 1);
                            this._startPhase(context, index);

                            break;

                        default:
                            this._transition.playAction(context, 'proceed', () => {
                                this._startPhase(context, index + 1);
                            });
                    }
                }, eventName => this._playEvent(context, eventName));

                break;

            case 19:
            default:
                this._maze.startLevel(-1);

                context.time.setTimeout(() => {
                    this._maze.startLevel(index, transitionType => {
                        switch (transitionType) {
                            case 'lose':
                                this._player.jump(0.04);
                                this._computer.showNoise(0.5, 0, 0.5, 0, index > 22 ? 0.3 : 1);
                                this._startPhase(context, index);

                                AudioManager.play('sound__virtual_destroyed');

                                break;

                            case 'scream_lose':
                                this._player.jump(0.04);

                                this._transition.playAction(context, 'scream', () => {
                                    this._startPhase(context, index);
                                });
                                this._monster.playAction(context, 'scream');

                                this._computer.showNoise(2, 2, 0.1, 0.3, 0, 0.5);

                                context.time.setTimeout(() => {
                                    this._computer.showNoise(2, 0, 0.5, 0, 0.3, 0.5);
                                }, 1000);

                                break;

                            case 'scream_win':
                                this._transition.playAction(context, 'proceed_fast', () => {
                                    this._startPhase(context, index + 1);
                                });

                                this._computer.showNoise(0.3, 0, 0.1, 0.3, 0.5, 0.5);

                                break;

                            case 'skip_transition':
                                this._startPhase(context, index + 1);

                                break;

                            case 'look_behind':
                                this._player.playAction(context, 'look_behind');

                                this._maze.startLevel(-1);

                                context.time.setTimeout(() => {
                                    this._startPhase(context, index + 1);
                                }, 4500);

                                context.time.setTimeout(() => {
                                    AudioManager.play('sound__clothes_rustle');
                                }, 1500);

                                context.time.setTimeout(() => {
                                    AudioManager.play('sound__clothes_rustle');
                                }, 5000);

                                break;

                            case 'encounter':
                                this._monster.playAction(context, 'encounter');
                                this._transition.playAction(context, 'encounter', () => {
                                    this._startPhase(context, index + 1);
                                });

                                context.time.setTimeout(() => {
                                    AudioManager.play('sound__monster_corridor');

                                    this._computer.playHorrorAmbient();
                                }, 7000);

                                this._computer.showNoise(0, 0.2, 8, 1, 0.3);

                                context.time.setTimeout(() => {
                                    this._computer.showNoise(0.2, 0, 0.5, 1, 0.3);
                                }, 13000);

                                break;
                            case 'proceed':
                                this._transition.playAction(context, 'proceed', () => {
                                    this._startPhase(context, index + 1);
                                });

                                break;

                            case 'ending':
                                this._player.playAction(context, 'ending');
                                this._monster.playAction(context, 'ending');

                                this._computer.showNoise(2, 2, 0.5, 0, 1.5, 0);

                                context.time.setTimeout(() => {
                                    this._computer.showNoise(2, 2, 0.5, 1.5, 0, 0);
                                }, 500);

                                context.time.setTimeout(() => {
                                    AudioManager.play('sound__camera');
                                }, 3000);

                                context.time.setTimeout(() => {
                                    this._computer.showNoise(2, 2, 1, 0, 0.2, 0);

                                    AudioManager.play('sound__stinger_2');
                                }, 7500);

                                context.time.setTimeout(() => {
                                    this._computer.showNoise(2, 2, 1, 0.2, 1, 0);
                                }, 7500);

                                context.time.setTimeout(() => {
                                    AudioManager.play('sound__ending_scream');
                                }, 10000);

                                context.time.setTimeout(() => {
                                    this._computer.showNoise(0, 0, 1, 0.3, 0);
                                }, 13000);

                                context.time.setTimeout(() => {
                                    this._transition.playAction(context, 'enter', () => {}, true);
                                }, 13500);
                                context.time.setTimeout(() => {
                                    this._transition.stop();
                                }, 14000);

                                context.time.setTimeout(() => {
                                    this._transition.playAction(context, 'descend', () => {}, true);
                                }, 14500);
                                context.time.setTimeout(() => {
                                    this._transition.stop();
                                }, 15000);

                                context.time.setTimeout(() => {
                                    this._transition.playAction(context, 'proceed', () => {}, true);
                                }, 15500);
                                context.time.setTimeout(() => {
                                    this._transition.stop();
                                }, 16000);

                                context.time.setTimeout(() => {
                                    this._monster.playAction(context, 'hide');

                                    this._transition.playAction(context, 'ending', () => {
                                        this._computer.reset(context);
                                        this._monster.playAction(context, 'hide');
                                        this._player.playAction(context, 'gone');
                                        this._computer.showNoise(0, 0, 0.1, 1, 1);
                                        this._maze.startLevel(25, () => {});

                                        AudioManager.stop();

                                        this._computer.playAmbient();
                                    }, true);
                                }, 16500);

                                this._computer.explode(context);
                                this._computer.fadeAmbient();

                                AudioManager.stop('wind');
                                AudioManager.play('sound__monitor_explode');

                                break;

                            default:
                                this._player.setFovLevel(Math.max(2, Math.min(index, 4)));
                                this._transition.playAction(context, 'descend', () => {
                                    this._startPhase(context, index + (transitionType === 'skip_level' ? 2 : 1));
                                });
                        }
                    }, eventName => this._playEvent(context, eventName));
                }, index === 19 ? 0 : 500);

                break;
        }
    }

    _playEvent(context, name) {
        if (this._eventUsed.has(name)) {
            return;
        }
        this._eventUsed.add(name);

        switch (name) {
            case 'noise_long':
                this._computer.showNoise(0.6, 0, 3, 1, 1);

                break;

            case 'noise_heavy':
                this._eventUsed.delete(name);

                this._computer.showNoise(0.3, 0, 3, 0.0, 1);

                break;

            case 'noise_repeat':
                this._eventUsed.delete(name);

                this._computer.showNoise(0.4, 0, 1, 0.7, 1);

                break;

            case 'chat':
                this._eventUsed.delete(name);

                AudioManager.play('sound__virtual_chat');

                break;

            case 'laugh':
                this._eventUsed.delete(name);

                AudioManager.play('sound__virtual_laugh');

                break;

            case 'touch_window':
                this._monster.playAction(context, 'touch_window');

                break;

            case 'leave_window':
                this._monster.playAction(context, 'leave_window');

                AudioManager.play('sound__stinger_1');

                break;

            case 'knocking':
                AudioManager.play('sound__knocking');

                break;

            case 'unlock_door':
                this._eventUsed.delete(name);

                AudioManager.play('sound__door_unlock');

                break;

            case 'open_door':
                AudioManager.play('sound__door_open', 1, false, true, 'open');

                break;

            case 'close_door':
                AudioManager.stop('open');
                AudioManager.play('sound__door_close');

                this._monster.playAction(context, 'close_door');

                break;

            case 'stare':
                this._monster.playAction(context, 'stare');

                this._computer.playHorrorAmbient();

                break;

            case 'walk':
                this._monster.playAction(context, 'walk', () => {
                    this._startPhase(context, 19);

                    AudioManager.stop('buildup');

                    context.time.setTimeout(() => {
                        this._computer.playAmbient();
                    }, 500);
                });

                context.time.setTimeout(() => {
                    AudioManager.play('sound__grab_buildup', 1, false, true, 'buildup');

                    this._computer.fadeAmbient(20);
                }, 3000);

                break;

            case 'hide':
                this._eventUsed.delete(name);

                this._monster.playAction(context, 'hide');

                break;

            case 'behind_monitor':
                context.time.setTimeout(() => {
                    this._monster.playAction(context, 'behind_monitor');

                    AudioManager.play('sound__stinger_3');
                }, 5600);

                break;
        }
    }
}

Director.p_register();
