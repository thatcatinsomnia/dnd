'use client';

import DraggableComponent from '#/components/DraggableComponent';
import { ColumnsIcon } from 'lucide-react';

function DragPreviewColumn() {
    return <ColumnsIcon className="p-2 size-10 bg-slate-800 rounded" />
}

export default function ColumnComponent() {
    return (
        <DraggableComponent 
            type="column"
            icon={<ColumnsIcon className="pointer-events-none" />}
            text="Column"
            preview={<DragPreviewColumn />}
        />
    );
}

