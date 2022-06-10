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

import { RecordingState } from '@app/Shared/Services/Api.service';
import {
  Button,
  ButtonVariant,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownPosition,
  DropdownToggle,
  Flex,
  FlexItem,
  InputGroup,
  Select,
  SelectOption,
  SelectVariant,
  TextInput,
  ToolbarFilter,
  ToolbarGroup,
  ToolbarItem,
  ToolbarToggleGroup,
} from '@patternfly/react-core';
import { FilterIcon, SearchIcon } from '@patternfly/react-icons';
import React, { Dispatch, SetStateAction } from 'react';
import { ActiveRecordingFilters } from './ActiveRecordingsTable';
import { DateTimePicker } from './DateTimePicker';
import { NameFilter } from './NameFilter';

export interface RecordingFiltersProps {
  filters: ActiveRecordingFilters;
  setFilters: Dispatch<SetStateAction<ActiveRecordingFilters>>;
}

export const RecordingFilters: React.FunctionComponent<RecordingFiltersProps> = (props) => {
  const [currentCategory, setCurrentCategory] = React.useState('Name');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = React.useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = React.useState(false);
  const [searchLabel, setSearchLabel] = React.useState('');
  const [continuous, setContinuous] = React.useState(false);
  const [duration, setDuration] = React.useState(30);
  const [startDateTime, setStartDateTime] = React.useState(new Date());
  const [stopDateTime, setStopDateTime] = React.useState(new Date());

  const onCategoryToggle = React.useCallback(() => {
    setIsCategoryDropdownOpen((opened) => !opened);
  }, [setIsCategoryDropdownOpen]);

  const onCategorySelect = React.useCallback(
    (curr) => {
      setCurrentCategory(curr);
    },
    [setCurrentCategory]
  );

  const onFilterToggle = React.useCallback(() => {
    setIsFilterDropdownOpen((opened) => !opened);
  }, [setIsFilterDropdownOpen]);

  const onDelete = React.useCallback(
    (type = '', id = '') => {
      if (type) {
        props.setFilters((old) => {
          return { ...old, [type]: old[type].filter((val) => val !== id) };
        });
      } else {
        props.setFilters(() => {
          return {
            Name: [],
            DateRange: [],
            DurationSeconds: [],
            State: [],
            Labels: [],
          };
        });
      }
    },
    [props.setFilters]
  );

  const onNameInput = React.useCallback(
    (inputName) => {
      props.setFilters((old) => {
        return { ...old, Name: old.Name.includes(inputName) ? old.Name : [...old.Name, inputName] };
      });
    },
    [props.setFilters]
  );

  const onDateRangeInput = React.useCallback(() => {
    props.setFilters((old) => {
      const newRange = `${startDateTime.toISOString()} to ${stopDateTime.toISOString()}`;
      return { ...old, DateRange: old.DateRange.includes(newRange) ? old.DateRange : [...old.DateRange, newRange] };
    });
  }, [startDateTime, stopDateTime, props.setFilters]);

  const onDurationInput = React.useCallback(
    (e) => {
      if (e.key && e.key !== 'Enter') {
        return;
      }

      props.setFilters((old) => {
        const dur = `${duration.toString()} s`;
        return {
          ...old,
          DurationSeconds: old.DurationSeconds.includes(dur) ? old.DurationSeconds : [...old.DurationSeconds, dur],
        };
      });
    },
    [duration, props.setFilters]
  );

  const onRecordingStateSelect = React.useCallback(
    (e, state) => {
      props.setFilters((old) => {
        return {
          ...old,
          State: old.State.includes(state) ? old.State.filter((v) => v != state) : [...old.State, state],
        };
      });
    },
    [props.setFilters]
  );

  const onContinuousDurationSelect = React.useCallback(
    (cont) => {
      setContinuous(cont);
      props.setFilters((old) => {
        return {
          ...old,
          DurationSeconds: cont
            ? [...old.DurationSeconds, 'continuous']
            : old.DurationSeconds.filter((v) => v != 'continuous'),
        };
      });
    },
    [setContinuous, props.setFilters]
  );

  const categoryDropdown = React.useMemo(() => {
    return (
      <ToolbarItem>
        <Dropdown
          position={DropdownPosition.left}
          toggle={
            <DropdownToggle onToggle={onCategoryToggle}>
              <FilterIcon /> {currentCategory}
            </DropdownToggle>
          }
          isOpen={isCategoryDropdownOpen}
          dropdownItems={[
            Object.keys(props.filters).map((cat) => (
              <DropdownItem key={cat} onClick={() => onCategorySelect(cat)}>
                {cat}
              </DropdownItem>
            )),
          ]}
        ></Dropdown>
      </ToolbarItem>
    );
  }, [Object.keys(props.filters), isCategoryDropdownOpen, onCategoryToggle, onCategorySelect]);

  const filterDropdownItems = React.useMemo(
    () => [
      <InputGroup>
        <NameFilter onSubmit={onNameInput} />
      </InputGroup>,
      <InputGroup>
        <DateTimePicker
          start={startDateTime}
          setStart={setStartDateTime}
          end={stopDateTime}
          setEnd={setStopDateTime}
          onSubmit={onDateRangeInput}
        />
      </InputGroup>,
      <InputGroup>
        <Flex>
          <FlexItem>
            <TextInput
              type="number"
              value={duration}
              id="durationInput1"
              aria-label="duration filter"
              onChange={(e) => setDuration(Number(e))}
              min="0"
              onKeyDown={onDurationInput}
            />
          </FlexItem>
          <FlexItem>
            <Checkbox
              label="Continuous"
              id="continuous-checkbox"
              isChecked={continuous}
              onChange={(checked) => onContinuousDurationSelect(checked)}
            />
          </FlexItem>
        </Flex>
      </InputGroup>,
      <Select
        variant={SelectVariant.checkbox}
        aria-label={'State'}
        onToggle={onFilterToggle}
        onSelect={onRecordingStateSelect}
        selections={props.filters.State}
        isOpen={isFilterDropdownOpen}
        placeholderText="Filter by state"
      >
        {Object.values(RecordingState).map((rs) => (
          <SelectOption key={rs} value={rs} />
        ))}
      </Select>,
      <InputGroup>
        <TextInput
          name="labelInput"
          id="labelInput1"
          type="search"
          aria-label="label filter"
          onChange={(label) => setSearchLabel(label)}
          value={searchLabel}
          placeholder="Filter by label..."
          onKeyDown={onNameInput}
        />
        <Button variant={ButtonVariant.control} aria-label="search button for label search input" onClick={onNameInput}>
          <SearchIcon />
        </Button>
      </InputGroup>,
    ],
    [Object.keys(props.filters)]
  );

  return (
    <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="xl">
      <ToolbarGroup variant="filter-group">
        {categoryDropdown}
        {Object.keys(props.filters).map((filterKey, i) => (
          <ToolbarFilter
            chips={props.filters[filterKey]}
            deleteChip={onDelete}
            categoryName={filterKey}
            showToolbarItem={currentCategory === filterKey}
          >
            {filterDropdownItems[i]}
          </ToolbarFilter>
        ))}
      </ToolbarGroup>
    </ToolbarToggleGroup>
  );
};
