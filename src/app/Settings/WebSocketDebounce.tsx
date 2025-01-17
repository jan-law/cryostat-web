/*
 * Copyright The Cryostat Authors
 *
 * The Universal Permissive License (UPL), Version 1.0
 *
 * Subject to the condition set forth below, permission is hereby granted to any
 * person obtaining a copy of this software, associated documentation and/or data
 * (collectively the "Software"), free of charge and under any and all copyright
 * rights in the Software, and any and all patent rights owned or freely
 * licensable by each licensor hereunder covering either (i) the unmodified
 * Software as contributed to or provided by such licensor, or (ii) the Larger
 * Works (as defined below), to deal in both
 *
 * (a) the Software, and
 * (b) any piece of software and/or hardware listed in the lrgrwrks.txt file if
 * one is included with the Software (each a "Larger Work" to which the Software
 * is contributed by such licensors),
 *
 * without restriction, including without limitation the rights to copy, create
 * derivative works of, display, perform, and distribute the Software and make,
 * use, sell, offer for sale, import, export, have made, and have sold the
 * Software and the Larger Work(s), and to sublicense the foregoing rights on
 * either these or other terms.
 *
 * This license is subject to the following condition:
 * The above copyright notice and either this complete permission notice or at
 * a minimum a reference to the UPL must be included in all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import * as React from 'react';
import { NumberInput, Text, TextVariants } from '@patternfly/react-core';
import { ServiceContext } from '@app/Shared/Services/Services';
import { UserSetting } from './Settings';

const defaultPreferences = {
  webSocketDebounceMs: 100,
}

const debounceMin = 1;
const debounceMax = 1000;

const Component = () => {
  const context = React.useContext(ServiceContext);
  const [state, setState] = React.useState(defaultPreferences);

  React.useLayoutEffect(() => {
    setState({
      webSocketDebounceMs: context.settings.webSocketDebounceMs(),
    });
  }, [setState, context.settings]);

  const handleWebSocketDebounceMinus = React.useCallback(() => {
    setState(state => {
      const newState = { ...state };
      let debounce = (state.webSocketDebounceMs || 1) - 1;
      if (debounce < debounceMin) {
        debounce = debounceMin;
      }
      newState.webSocketDebounceMs = debounce;
      context.settings.setWebSocketDebounceMs(newState.webSocketDebounceMs)
      return newState;
    });
  }, [setState, context.settings]);

  const handleWebSocketDebouncePlus = React.useCallback(() => {
    setState(state => {
      const newState = { ...state };
      let debounce = (state.webSocketDebounceMs || 1) + 1;
      if (debounce > debounceMax) {
        debounce = debounceMax;
      }
      newState.webSocketDebounceMs = debounce;
      context.settings.setWebSocketDebounceMs(newState.webSocketDebounceMs)
      return newState;
    });
  }, [setState, context.settings]);

  const handleWebSocketDebounceChange = React.useCallback(event => {
    let webSocketDebounceMs = isNaN(event.target.value) ? 0 : Number(event.target.value);
    if (webSocketDebounceMs < debounceMin) {
      webSocketDebounceMs = debounceMin;
    } else if (webSocketDebounceMs > debounceMax) {
      webSocketDebounceMs = debounceMax;
    }
    setState(state => ({ ...state, webSocketDebounceMs }));
    context.settings.setWebSocketDebounceMs(webSocketDebounceMs);
  }, [setState, context.settings]);

  return (<>
    <NumberInput
      value={state.webSocketDebounceMs}
      min={debounceMin}
      max={debounceMax}
      onChange={handleWebSocketDebounceChange}
      onMinus={handleWebSocketDebounceMinus}
      onPlus={handleWebSocketDebouncePlus}
      unit="ms"
    />
  </>);
}

export const WebSocketDebounce: UserSetting = {
  title: 'WebSocket Connection Debounce',
  description: `Set the debounce time (in milliseconds) used when establishing WebSocket connections.
    Increase this time if the web-interface repeatedly displays WebSocket connection/disconnection messages.
    Decrease this time if the web-interface takes a long time to populate on startup.`,
  content: Component,
}

