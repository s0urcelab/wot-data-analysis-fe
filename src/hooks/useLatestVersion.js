import { useState, useEffect } from 'react';
import API from '@/api';

export default function useLatestVersion() {
    const [version, setVersion] = useState('未知');
    useEffect(async () => {
        const html = await API('/mod.version', {
            method: 'GET',
        });
        const re = /<script>\s*DATA\s*=\s*({[\s\S]*?})\s*<\/script>/;

        const match = html.match(re);
        const data = JSON.parse(match[1]);
        const vers = data.paths.filter((v) => v.path_type === 'Dir');
        const latest = Math.max(...vers.map((v) => v.mtime));
        const latestVersion = vers.find((v) => v.mtime === latest).name;
        setVersion(latestVersion);
    }, []);

    return version;
}
