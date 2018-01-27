/* eslint-env browser */
'use strict';

import '../styles/style.scss';

import mdcAutoInit from '@material/auto-init';
import {MDCRipple} from '@material/ripple';
import {MDCTabBar, MDCTabBarScroller} from '@material/tabs';
import {initSkillActions} from "./skillToggle";
import {initTabbing} from './skillFilter';

mdcAutoInit.register('MDCTabBarScroller', MDCTabBarScroller);
mdcAutoInit.register('MDCTabBar', MDCTabBar);
mdcAutoInit.register('MDCRipple', MDCRipple);
mdcAutoInit();

initTabbing(); // This needs to happen after UI is initialized since we remove one of the tab-indicators here.
initSkillActions();
