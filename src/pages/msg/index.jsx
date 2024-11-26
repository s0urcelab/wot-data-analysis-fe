import { useState, useLayoutEffect } from 'react';
import { Tag, Card, Comment, Tooltip, List } from 'antd';
import './index.less';

function MessageBoard() {
    useLayoutEffect(() => {
        Artalk.init({
            el: '#artalk-comments',
            server: 'https://artalk.src.moe/',
            site: '坦克世界360国服数据站',
            darkMode: false,
        });
    }, []);

    return (
        <Card className="comment-card-container">
            <div id="artalk-comments"></div>
        </Card>
    );
}

export default MessageBoard;
