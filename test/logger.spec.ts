/**
 * @license
 * Copyright Nikita Yaroshevich All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/nikita-yaroshevich/avl-core/blob/master/LICENSE
 */

import {TestBed, inject} from "@angular/core/testing";
/**
 * Created by Nikita Yaroshevich on 17/09/2016.
 */

describe('Logger service', () => {

    beforeEach(() => {
        // spyOn(console, 'timeEnd');
    });

    describe('with level OFF', () => {
        beforeEach(() => {
            // TestBed.configureTestingModule({imports: [NgLoggerModule.forRoot(Level.OFF)]});
        });

        it('should not call anything', (inject([], () => {
            // logger.log('log', 'param');
            // logger.debug('debug', 'param');
            // logger.info('info', 'param');
            // logger.warn('warn', 'param');
            // logger.error('error', 'param');
            // logger.group('group');
            // logger.groupCollapsed('groupCollapsed');
            // logger.groupEnd();
            // logger.time('time');
            // logger.timeEnd('time');
            //
            // expect(console.log).not.toHaveBeenCalled();
            // expect(console.debug).not.toHaveBeenCalled();
            // expect(console.info).not.toHaveBeenCalled();
            // expect(console.warn).not.toHaveBeenCalled();
            // expect(console.error).not.toHaveBeenCalled();
            // expect(console.group).not.toHaveBeenCalled();
            // expect(console.groupCollapsed).not.toHaveBeenCalled();
            // expect(console.groupEnd).not.toHaveBeenCalled();
            // expect(console.time).not.toHaveBeenCalled();
            // expect(console.timeEnd).not.toHaveBeenCalled();
        })));
    });

    describe('with level ERROR', () => {
        beforeEach(() => {
            // TestBed.configureTestingModule({imports: [NgLoggerModule.forRoot(Level.ERROR)]});
        });

        it('should call groups and error', (inject([], () => {
            // expect(logger.level).toBe(Level.ERROR);
            //
            // logger.log('log', 'param');
            // logger.debug('debug', 'param');
            // logger.info('info', 'param');
            // logger.warn('warn', 'param');
            // logger.error('error', 'param');
            // logger.group('group');
            // logger.groupCollapsed('groupCollapsed');
            // logger.groupEnd();
            // logger.time('time');
            // logger.timeEnd('time');
            //
            // expect(console.log).not.toHaveBeenCalled();
            // expect(console.debug).not.toHaveBeenCalled();
            // expect(console.info).not.toHaveBeenCalled();
            // expect(console.warn).not.toHaveBeenCalled();
            // expect(console.error).toHaveBeenCalledWith('error', 'param');
            // expect(console.group).toHaveBeenCalledWith('group');
            // expect(console.groupCollapsed).toHaveBeenCalledWith('groupCollapsed');
            // expect(console.groupEnd).toHaveBeenCalled();
            // expect(console.time).not.toHaveBeenCalled();
            // expect(console.timeEnd).not.toHaveBeenCalled();
        })));
    });

});