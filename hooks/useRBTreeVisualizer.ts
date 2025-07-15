import { useEffect, useRef, useState } from 'react';
import { RBTree } from '../struct/RBTree/classes/RBTree';
import type { RotationRecord } from '../struct/RBTree/classes/RBTree';
import { RBNode } from '../struct/RBTree/classes/RBNode';

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function generateUniqueNumbers(count: number, min: number, max: number): number[] {
    const set = new Set<number>();
    while (set.size < count) {
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        set.add(num);
    }
    return [...set];
}

export function useRBTreeVisualizer({
    count = 30,
    interval = 1500,
    min = 1,
    max = 100,
}: {
    count?: number;
    interval?: number;
    min?: number;
    max?: number;
}) {
    const tree = useRef(new RBTree<number>()).current;
    const [root, setRoot] = useState<RBNode<number> | null>(null);
    const [insertedCount, setInsertedCount] = useState(0);
    const [currentValue, setCurrentValue] = useState<number | null>(null);
    const [pathToDraw, setPathToDraw] = useState<number[]>([]);
    const [rotationInfo, setRotationInfo] = useState<RotationRecord<number> | null>(null);

    useEffect(() => {
        let cancelled = false;
        const numbers = generateUniqueNumbers(count, min, max);

        (async () => {
            for (const value of numbers) {
                if (cancelled) break;
                setCurrentValue(value);
                const path = tree.insertWithPath(value);
                setRotationInfo(null);

                for (let i = 1; i <= path.length; i++) {
                    if (cancelled) break;
                    setPathToDraw(path.slice(0, i));
                    await delay(interval / path.length);
                }

                if (tree.rotations.length > 0) {
                    const lastRotation = tree.rotations.shift()!;
                    setRotationInfo(lastRotation);
                    await delay(interval);
                }

                setRoot({ ...tree.root! });
                setInsertedCount(c => c + 1);
            }

            setCurrentValue(null);
            setPathToDraw([]);
            setRotationInfo(null);
        })();

        return () => { cancelled = true; };
    }, []);

    return { root, insertedCount, currentValue, pathToDraw, rotationInfo };
}
