/* eslint-env browser */
'use strict';

import '../styles/style.scss';

import './skillFilter';
import './skillToggle';

import mdcAutoInit from '@material/auto-init';
import {MDCRipple} from '@material/ripple';
import {MDCTabBar, MDCTabBarScroller} from '@material/tabs';

mdcAutoInit.register('MDCTabBarScroller', MDCTabBarScroller);
mdcAutoInit.register('MDCTabBar', MDCTabBar);
mdcAutoInit.register('MDCRipple', MDCRipple);
mdcAutoInit();
