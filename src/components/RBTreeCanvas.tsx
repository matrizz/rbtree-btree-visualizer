import { useEffect, useRef, useState } from 'react';
import { RBNode } from '../../struct/RBTree/classes/RBNode';
import type { RotationRecord } from '../../struct/RBTree/classes/RBTree';

type Props = {
    root: RBNode<number> | null;
    path?: number[];
    rotation?: RotationRecord<number> | null;
};

function getTreeDepth(node: RBNode<number> | null): number {
    if (!node) return 0;
    return 1 + Math.max(getTreeDepth(node.left), getTreeDepth(node.right));
}

export default function RBTreeCanvas({ root, path = [], rotation }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [animating, setAnimating] = useState(false);
    const [animationProgress, setAnimationProgress] = useState(0);

    const minWidth = 1200;
    const minHeight = 800;
    const width = minWidth;
    const height = minHeight;

    useEffect(() => {
        if (rotation) {
            setAnimating(true);
            setAnimationProgress(0);
        }
    }, [rotation]);

    useEffect(() => {
        if (!animating) return;
        let frame = 0;
        const totalFrames = 20;
        function animate() {
            frame++;
            setAnimationProgress(frame / totalFrames);
            if (frame < totalFrames) {
                requestAnimationFrame(animate);
            } else {
                setAnimating(false);
                setAnimationProgress(1);
            }
        }
        animate();
    }, [animating]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !root) return;

        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        ctx.clearRect(0, 0, width, height);

        const depth = getTreeDepth(root);

        function getNodePosition(node: RBNode<number>, x: number, y: number, level: number, positions: Record<number, { x: number, y: number }>) {
            const nodesAtLevel = Math.pow(2, level);
            const horizontalGap = width / (nodesAtLevel + 1);
            const verticalGap = Math.max(60, (height - 100) / depth);

            positions[node.data] = { x, y };
            if (node.left) getNodePosition(node.left, x - horizontalGap / 2, y + verticalGap, level + 1, positions);
            if (node.right) getNodePosition(node.right, x + horizontalGap / 2, y + verticalGap, level + 1, positions);
        }

        const finalPositions: Record<number, { x: number, y: number }> = {};
        getNodePosition(root, width / 2, 60, 0, finalPositions);

        let startPositions: Record<number, { x: number, y: number }> = {};
        if (animating && rotation) {
            rotation.nodes.forEach((data) => {
                if (finalPositions[data]) {
                    startPositions[data] = {
                        x: finalPositions[data].x,
                        y: finalPositions[data].y - 40
                    };
                }
            });
        }

        function drawNode(node: RBNode<number>, x: number, y: number, level: number) {
            if (!ctx) return;
            const radius = 20;
            const offsetX = Math.max(30, 240 / (level + 1));

            if (node.left) {
                const childX = x - offsetX;
                const childY = y + 80;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(childX, childY);
                ctx.strokeStyle = '#999';
                ctx.stroke();
                drawNode(node.left, childX, childY, level + 1);
            }
            if (node.right) {
                const childX = x + offsetX;
                const childY = y + 80;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(childX, childY);
                ctx.strokeStyle = '#999';
                ctx.stroke();
                drawNode(node.right, childX, childY, level + 1);
            }

            let drawX = x, drawY = y;
            if (animating && rotation?.nodes.includes(node.data)) {
                const start = startPositions[node.data];
                if (start) {
                    drawX = start.x + (x - start.x) * animationProgress;
                    drawY = start.y + (y - start.y) * animationProgress;
                }
            }

            ctx.beginPath();
            ctx.arc(drawX, drawY, radius, 0, Math.PI * 2);

            if (rotation?.nodes.includes(node.data)) {
                ctx.fillStyle = '#3b82f6';
            } else if (path.includes(node.data)) {
                ctx.fillStyle = '#facc15';
            } else {
                ctx.fillStyle = node.color === 'red' ? '#ef4444' : '#111827';
            }

            ctx.strokeStyle = '#1f2937';
            ctx.lineWidth = 2;
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 14px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(String(node.data), drawX, drawY);
        }

        drawNode(root, width / 2, 60, 0);

        if (rotation) {
            ctx.fillStyle = '#111827';
            ctx.font = '20px monospace';
            ctx.fillText(
                `${rotation.type} Rotation`,
                width / 10,
                height - 760
            );
        }
    }, [root, path, rotation, animating, animationProgress, width, height]);

    return (
        <div className="w-full flex flex-row-reverse overflow-auto p-4 bg-gray-100 rounded-xl shadow">
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className={`border min-w-[${minWidth}] min-h-[${minHeight}] w-[${width}] h-[${height}] border-gray-300 rounded-xl`}
            />
        </div>
    );
}
