import { Select, Spin } from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import './index.less';

const debounce = (func, timeout) => {
    let tid;
    return (...arg) => {
        if (tid) {
            clearTimeout(tid);
        }
        tid = setTimeout(() => func(...arg), timeout);
    };
};

export default function DebounceSelect({ fetchOptions, debounceTimeout = 800, ...props }) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);
    const fetchRef = useRef(0);
    const debounceFetcher = useMemo(() => {
        const loadOptions = (value) => {
            fetchRef.current += 1;
            const fetchId = fetchRef.current;
            setOptions([]);
            setFetching(true);
            fetchOptions(value).then((newOptions) => {
                if (fetchId !== fetchRef.current) {
                    // for fetch callback order
                    return;
                }
                setOptions(newOptions);
                setFetching(false);
            });
        };
        return debounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout]);
    return (
        <Select
            showSearch
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={
                fetching ? (
                    <div className="player-name-loading">
                        <Spin />
                    </div>
                ) : undefined
            }
            {...props}
        >
            {options.map((v) => (
                <Select.Option key={v.id} value={v.id} title={v.name}>
                    {v.clan ? <span className="plnl-option-clan">[{v.clan}]</span> : ''} {v.name}
                </Select.Option>
            ))}
        </Select>
    );
}
