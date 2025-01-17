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
import { Title, EmptyState, EmptyStateIcon, EmptyStateBody, Button, EmptyStateSecondaryActions } from '@patternfly/react-core';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import { TableComposable, Thead, Tr, Th, OuterScrollContainer, InnerScrollContainer } from '@patternfly/react-table';
import { LoadingView } from '@app/LoadingView/LoadingView';
import { ErrorView } from '@app/ErrorView/ErrorView';

export interface RecordingsTableProps {
  toolbar: React.ReactElement;
  tableColumns: string[];
  tableTitle: string;
  isEmpty: boolean;
  isEmptyFilterResult?: boolean;
  isHeaderChecked: boolean;
  isLoading: boolean;
  isNestedTable: boolean;
  errorMessage: string;
  onHeaderCheck: (event, checked: boolean) => void;
  clearFilters?: (filterType) => void;
}

export const RecordingsTable: React.FunctionComponent<RecordingsTableProps> = (props) => {
  let view: JSX.Element;
  if (props.errorMessage != '') {
    view = (<ErrorView message={props.errorMessage}/>)
  } else if (props.isLoading) {
    view = (<LoadingView/>)
  } else if (props.isEmpty) {
    view = (<>
      <EmptyState>
        <EmptyStateIcon icon={SearchIcon}/>
        <Title headingLevel="h4" size="lg">
          No {props.tableTitle}
        </Title>
      </EmptyState>
    </>);
  } else if (props.isEmptyFilterResult) {
    view = (<>
      <EmptyState>
        <EmptyStateIcon icon={SearchIcon}/>
        <Title headingLevel="h4" size="lg">
          No {props.tableTitle} found
        </Title>
        <EmptyStateBody>
          No results match this filter criteria. 
          Remove all filters or clear all filters to show results.
        </EmptyStateBody>
        <EmptyStateSecondaryActions>
          <Button variant="link" onClick={() => props.clearFilters && props.clearFilters(null)}>
            Clear all filters
          </Button>
        </EmptyStateSecondaryActions>
      </EmptyState>
    </>);
  } else {
    view = (<>
      <TableComposable aria-label={props.tableTitle} isStickyHeader={props.isNestedTable} variant={props.isNestedTable ? 'compact' : undefined}>
        <Thead>
          <Tr>
            <Th
              key="table-header-check-all"
              select={{
                onSelect: props.onHeaderCheck,
                isSelected: props.isHeaderChecked
              }}
            />
            <Th key="table-header-expand"/>
            {props.tableColumns.map((key, idx) => (
              <Th key={`table-header-${key}`}>{key}</Th>
            ))}
            <Th key="table-header-actions"/>
          </Tr>
        </Thead>
        { props.children }
      </TableComposable>
    </>);
  }

  if (props.isNestedTable) {
    return (<> 
      <OuterScrollContainer style={{ height: '500px' }}>
        { props.toolbar }
        <InnerScrollContainer>
          { view }
        </InnerScrollContainer>
      </OuterScrollContainer>
    </>);
  }

  return (<>
    { props.toolbar }
    { view }
  </>);
};
