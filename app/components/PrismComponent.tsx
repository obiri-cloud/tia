import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css';
import "prismjs/components/prism-jsx";

// Import language components as needed
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-docker';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-nginx';
import 'prismjs/themes/prism.css';

export default function PrismComponent({ content }: { content: string }) {
    useEffect(() => {
        Prism.highlightAll();
    }, [content]);

    return (
        <div className='all-initial prism-content mb-[500px]' dangerouslySetInnerHTML={{ __html: content }} />
    );
}